"""本番の画面録画・写真・合成音声から、縦型PVと15秒版を再生成する。"""
import argparse
from functools import lru_cache
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import wave

import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'marketing/pv/source'
VOICE = ROOT / 'marketing/pv/voice'
OUT = ROOT / 'assets/promo'
WORK = Path(os.environ.get('PROMO_WORK_DIR', '/tmp/type-checker-pv'))
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
CAPTURE = json.loads((SOURCE / 'capture.json').read_text())
W, H, FPS, SR = 1080, 1920, 30, 48000
INK = '#202126'
CORAL = '#f04768'
CREAM = '#fff9ee'
MINT = '#ccf5dc'
FONT_DIR = Path(os.environ.get('PROMO_FONT_DIR', str(Path.home() / '.local/share/fonts')))
CUTS = [(0, 2.5), (10, 13), (13.5, 15), (16.5, 18.5), (18.5, 21), (26, 29.5)]
VOICES_30 = [
    (0.15, 2.65, 'hook'), (3.05, 0.9, 'left'), (4.2, 1.55, 'right'),
    (6.1, 2.5, 'neither'), (8.65, 1.2, 'okay'), (10.15, 3.15, 'twenty'),
    (13.6, 2.6, 'both'), (16.55, 1.8, 'reveal'), (18.85, 2.6, 'reaction'),
    (23.05, 2.75, 'friends'), (26.2, 3.5, 'cta'),
]
VOICES_15 = [
    (0.1, 2.3, 'hook'), (2.65, 2.7, 'twenty'), (5.55, 1.4, 'both'),
    (7.1, 1.8, 'reveal'), (9.1, 2.25, 'reaction'), (11.8, 2.9, 'cta_short'),
]


@lru_cache(maxsize=80)
def font(size, bold=True):
    return ImageFont.truetype(str(FONT_DIR / ('NotoSansCJK-Bold.ttc' if bold else 'NotoSansCJK-Regular.ttc')), size, index=0)


def text(im, value, x, y, size=80, fill=INK, anchor='lt', max_width=None, bold=True):
    draw = ImageDraw.Draw(im)
    while max_width and draw.textlength(value, font=font(size, bold)) > max_width:
        size -= 1
    draw.text((round(x), round(y)), value, font=font(size, bold), fill=fill, anchor=anchor, stroke_width=0)


def center(im, value, y, size=80, fill=INK, width=870, x=505):
    text(im, value, x, y, size, fill, anchor='mt', max_width=width)


def rounded(im, rect, fill, radius=30, outline=None, width=1):
    ImageDraw.Draw(im).rounded_rectangle(tuple(round(n) for n in rect), radius, fill, outline, width)


def paste_round(im, tile, x, y, radius=25, shadow=True):
    x, y = round(x), round(y)
    if shadow:
        rounded(im, (x + 5, y + 12, x + tile.width + 5, y + tile.height + 12), '#28252c', radius)
    mask = Image.new('L', tile.size)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, tile.width - 1, tile.height - 1), radius, fill=255)
    im.paste(tile, (x, y), mask)


@lru_cache(maxsize=64)
def photo(path, width, height):
    return ImageOps.fit(Image.open(ROOT / path).convert('RGB'), (width, height), method=Image.Resampling.LANCZOS)


@lru_cache(maxsize=16)
def screenshot(gender, name):
    return Image.open(SOURCE / f'{gender}-{name}.png').convert('RGB')


@lru_cache(maxsize=4)
def background(style):
    top, bottom = {
        'cream': ((255, 240, 228), (251, 251, 236)),
        'mint': ((219, 250, 231), (248, 253, 240)),
        'pink': ((255, 209, 220), (255, 246, 229)),
        'dark': ((34, 34, 43), (61, 44, 61)),
    }[style]
    yy = np.linspace(0, 1, H)[:, None, None]
    arr = np.broadcast_to(np.asarray(top)[None, None, :] * (1 - yy) + np.asarray(bottom)[None, None, :] * yy, (H, W, 3))
    im = Image.fromarray(arr.astype('uint8'))
    d = ImageDraw.Draw(im)
    color = '#ffc0d0' if style != 'dark' else '#51425b'
    d.ellipse((750, -170, 1390, 470), fill=color)
    d.ellipse((-380, 1360, 380, 2120), fill='#c7efd9' if style != 'dark' else '#343e40')
    for y in range(160, 1750, 95):
        for x in (35, 1015):
            d.ellipse((x, y, x + 5, y + 5), fill='#d5bcb3' if style != 'dark' else '#777080')
    return im


def badge(im, value, y=130, dark=False):
    width = int(ImageDraw.Draw(im).textlength(value, font=font(28))) + 52
    rounded(im, (65, y, 65 + width, y + 57), CREAM if dark else INK, 28)
    text(im, value, 91, y + 12, 28, INK if dark else CREAM)


def footer(im, dark=False, note='好みの顔タイプ診断'):
    text(im, note, 70, 1660, 27, '#e3d6df' if dark else '#70666b', bold=False)
    text(im, 'SHIAN STUDIO', 70, 1730, 20, '#e3d6df' if dark else '#70666b')


def entrance(t, start, distance=60):
    a = min(1, max(0, (t - start) / 0.35))
    return distance * (1 - a) ** 3


VIDEOS = {}


def video_frame(gender, seconds):
    if gender not in VIDEOS:
        VIDEOS[gender] = cv2.VideoCapture(str(SOURCE / f'{gender}-session.webm'))
    cap = VIDEOS[gender]
    target = max(0, int(seconds * cap.get(cv2.CAP_PROP_FPS)))
    current = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
    if target < current or target - current > 8:
        cap.set(cv2.CAP_PROP_POS_FRAMES, target)
        current = target
    for _ in range(target - current + 1):
        ok, frame = cap.read()
    if not ok:
        raise RuntimeError(f'録画を読めません: {gender} / {seconds}')
    # 写真のデコードを待つ瞬間だけを詰める。補間画像は作らず、直後の実録画フレームを使う。
    for _ in range(12):
        b = CAPTURE['sessions'][gender]['duelBounds']
        x, y, w, h = [round(b[k]) for k in ('x', 'y', 'width', 'height')]
        regions = (frame[y+20:y+h-20, x+10:x+w//2-20], frame[y+20:y+h-20, x+w//2+20:x+w-10])
        if all(float(region.std(axis=(0, 1)).mean()) > 8 for region in regions):
            break
        ok, candidate = cap.read()
        if not ok:
            break
        frame = candidate
    # Playwright録画の実ページ領域。
    return Image.fromarray(cv2.cvtColor(frame[:880, :440], cv2.COLOR_BGR2RGB))


def event(gender, name, index=None):
    return next(e['time'] for e in CAPTURE['sessions'][gender]['events'] if e['name'] == name and (index is None or e.get('index') == index))


def screen_video(im, gender, seconds, y=480, w=870, crop=(0, 0, 440, 515), taps=True):
    original = video_frame(gender, seconds)
    tile = original.crop(crop)
    h = round(tile.height * w / tile.width)
    tile = tile.resize((w, h), Image.Resampling.LANCZOS)
    x = 65
    paste_round(im, tile, x, y, 28)
    if taps:
        d = ImageDraw.Draw(im)
        for e in CAPTURE['sessions'][gender]['events']:
            delta = seconds - e['time']
            if e['name'] == 'tap' and 0 <= delta <= .4:
                cx = x + (e['x'] - crop[0]) * w / (crop[2] - crop[0])
                cy = y + (e['y'] - crop[1]) * w / (crop[2] - crop[0])
                if y <= cy <= y + h:
                    radius = 15 + delta * 90
                    d.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), outline=CORAL, width=max(2, int(9*(1-delta/.4))))
    return h


def portraits(im, t, y=620, width=416, height=555):
    for i, gender in enumerate(['female', 'male']):
        asset = f'assets/{gender}/{gender}_011.png'
        tile = Image.new('RGB', (width + 16, height + 16), 'white')
        tile.paste(photo(asset, width, height), (8, 8))
        wobble = math.sin(t * 2 + i) * 8
        gap = 34
        left = (1010 - 2 * tile.width - gap) / 2
        paste_round(im, tile, left + i * (tile.width + gap), y + wobble, 30)


@lru_cache(maxsize=8)
def result_tile(gender, width, height):
    """最新の結果カードを実画面のまま縮小。キャラクターと分類を一致させる。"""
    src = screenshot(gender, 'result-card')
    tile = Image.new('RGB', (width, height), '#f3f4ec')
    fitted = ImageOps.contain(src, (width, height), Image.Resampling.LANCZOS)
    tile.paste(fitted, ((width-fitted.width)//2, (height-fitted.height)//2))
    return tile


def reaction(im, value, t, start, x=650, y=1375):
    """演出のリアクション字幕を、画面外の吹き出しで弾ませる。"""
    elapsed = t-start
    if elapsed < 0:
        return
    scale = 1 + .10 * math.exp(-elapsed*7) * math.sin(elapsed*24)
    width = min(800, int(ImageDraw.Draw(im).textlength(value, font=font(58))) + 84)
    bubble = Image.new('RGBA', (width+20, 150))
    d = ImageDraw.Draw(bubble)
    d.rounded_rectangle((0, 0, width, 110), 40, INK)
    d.polygon([(width-90, 100), (width-50, 100), (width-35, 139)], fill=INK)
    text(bubble, value, width/2, 22, 58, CREAM, anchor='mt')
    bubble = bubble.resize((round(bubble.width*scale), round(bubble.height*scale)), Image.Resampling.LANCZOS)
    im.paste(bubble, (round(x-bubble.width/2), round(y)), bubble)



def frame_at(t):
    dark = 16.5 <= t < 18.5
    style = 'dark' if dark else ('mint' if 3 <= t < 6 or 13.5 <= t < 16.5 else 'pink' if t >= 18.5 else 'cream')
    im = background(style).copy()
    badge(im, '好きが見つかる、20タップ。', dark=dark)
    if t < 3:
        dy = entrance(t, 0)
        center(im, '好きな顔、', 265 + dy, 114)
        center(im, '秒で選べる？', 418 + dy, 109, CORAL)
        portraits(im, t, 645 + entrance(t, .12), 408, 544)
        rounded(im, (110, 1290, 910, 1410), INK, 55)
        center(im, '直感で、どっち？', 1318, 63, CREAM)
        center(im, 'ちょっと迷う。だから楽しい。', 1470, 36)
    elif t < 6:
        center(im, 'こっち！' if t < 4.2 else '…いや、こっち！', 275 + entrance(t, 3 if t < 4.2 else 4.2), 105, CORAL)
        start = event('female', 'choice-before', 1) - .4
        screen_video(im, 'female', start + (t - 3) * 1.13, 470)
        reaction(im, '待って、迷う！', t, 4.5, x=680, y=1468)
        if t < 4.5:
            center(im, 'タップで選ぶだけ。', 1548, 41)
    elif t < 10:
        center(im, 'え、選べない？', 265 + entrance(t, 6), 102)
        start = event('female', 'skip-before')
        screen_video(im, 'female', start + min(3.3, (t - 6) * .95), 470)
        if t >= 8.55:
            rounded(im, (190, 1460, 820, 1580), CORAL, 55)
            center(im, 'それもアリ！', 1485, 68, 'white')
        else:
            center(im, 'そんなときは、このボタン。', 1548, 38)
    elif t < 13.5:
        center(im, '好きな顔を', 245 + entrance(t, 10), 68)
        center(im, '20回タップ！', 342 + entrance(t, 10), 108, CORAL)
        start, end = event('female', 'choice-before', 4), event('female', 'choice-before', 20) - .25
        screen_video(im, 'female', start + (end - start) * (t - 10) / 3.5, 510, crop=(0, 73, 440, 514))
        center(im, 'あなたの「好き」が集まっていく。', 1470, 37)
        text(im, '実際の操作映像・一部早送り', 72, 1550, 25, '#756b70', bold=False)
    elif t < 16.5:
        center(im, '男性も、女性も。', 280 + entrance(t, 13.5), 94)
        gender = 'male' if t < 15 else 'female'
        start = event(gender, 'choice-before', 1) - .25
        screen_video(im, gender, start + ((t - 13.5) % 1.5) * 1.5, 490)
        center(im, '気になるほうで、遊べる。', 1545, 42)
    elif t < 18.5:
        center(im, 'そして、', 290 + entrance(t, 16.5), 90, CREAM)
        center(im, '結果は…？', 435, 122, '#ffe68a')
        src = screenshot('female', 'last-choice').crop((0, 145, 880, 1025))
        paste_round(im, src.resize((790, 790), Image.Resampling.LANCZOS), 110, 685, 28)
        # カウントダウンは編集上の演出。サイトの診断進行表示とは別に置く。
        center(im, 'あなたの好みが、もうすぐ。', 1530, 40, CREAM)
    elif t < 23:
        center(im, '好み、出ちゃった。', 264 + entrance(t, 18.5), 90, CORAL)
        session = CAPTURE['sessions']['female']
        center(im, session['resultCode'], 402 + entrance(t, 18.5), 128)
        card = result_tile('female', 640, 865)
        paste_round(im, card, 185, 550 + entrance(t, 18.5), 26)
        reaction(im, 'え、好き。', t, 20, x=735, y=1295)
        # 結果に対応する現行の顔5枚を、動画でも省略せず見せる。
        for i, face in enumerate(session['examplePortraits']):
            paste_round(im, photo(face['src'].split('?')[0], 112, 149), 194+i*128, 1440, 12, shadow=False)
        # 一度だけの紙吹雪。顔とコピーの可読性を保つため外周に配置。
        d = ImageDraw.Draw(im)
        for i in range(20):
            x = 25 + (i * 83) % 1020
            if 140 < x < 900:
                continue
            y = 420 + ((t - 18.5) * (130 + i * 5) + i * 117) % 1160
            d.rectangle((x, y, x + 12, y + 28), fill=[CORAL, '#d5ad2c', '#4f988a'][i % 3])
        text(im, '実際の診断結果の一例', 74, 1610, 25, '#70666b', bold=False)
    elif t < 26:
        center(im, '友だちと', 265 + entrance(t, 23), 90)
        center(im, '比べてみて！', 397 + entrance(t, 23), 110, CORAL)
        for i, gender in enumerate(['female', 'male']):
            tile = result_tile(gender, 405, 805)
            center(im, CAPTURE['sessions'][gender]['resultCode'], 568, 65, x=272+i*450)
            paste_round(im, tile, 70 + i * 450, 665 + math.sin(t*2+i)*7, 26)
        center(im, '同じ？ 違う？ それも楽しい。', 1528, 39)
    else:
        center(im, 'あなたは、どの顔？', 270 + entrance(t, 26), 84)
        center(im, '好みの顔', 435, 114, CORAL)
        center(im, 'タイプ診断', 577, 114, CORAL)
        portraits(im, t, 790, 280, 374)
        rounded(im, (70, 1280, 940, 1425), INK, 65)
        center(im, '今すぐ診断する', 1310, 70, 'white')
        center(im, 'type-checker.shianstudio.com', 1475, 43, INK, width=880)
        center(im, '※登場する顔画像はAI生成です。', 1575, 27, '#70666b')
    footer(im, dark)
    # 薄い進行線。SNSの操作UIと重ならない装飾位置。
    ImageDraw.Draw(im).rectangle((0, H - 10, round(W * t / 30), H), fill=CORAL)
    return im


def map_short(t):
    for a, b in CUTS:
        if t < b - a:
            return a + t
        t -= b - a
    return CUTS[-1][1] - 1/FPS


def read_voice(key, max_duration):
    raw = subprocess.check_output([FFMPEG, '-v', 'error', '-i', str(VOICE/f'{key}.mp3'), '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-'])
    pcm = np.frombuffer(raw, dtype='<f4').copy()
    active = np.flatnonzero(np.abs(pcm) > .006)
    if not len(active):
        raise RuntimeError(f'音声が無音です: {key}')
    pcm = pcm[max(0, active[0]-int(.025*SR)):min(len(pcm), active[-1]+int(.06*SR))]
    if len(pcm) > int(max_duration*SR):
        ratio = len(pcm)/(max_duration*SR)
        raw = subprocess.run([FFMPEG, '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', f'atempo={ratio:.6f}', '-f', 'f32le', '-'], input=pcm.astype('<f4').tobytes(), stdout=subprocess.PIPE, check=True).stdout
        pcm = np.frombuffer(raw, dtype='<f4').copy()
    pcm = pcm[:int(max_duration*SR)]
    rms = np.sqrt(np.mean(pcm**2))
    pcm *= min(.16/max(rms, .001), .82/max(np.max(np.abs(pcm)), .001))
    return pcm


def music(duration):
    """外部楽曲・サンプルを使わない、120 BPMのオリジナル・シンセポップ。"""
    n = round(duration*SR)
    mix = np.zeros((n, 2), np.float32)
    rng = np.random.default_rng(20260910)

    def add(signal, at, volume=1, pan=0):
        index = round(at*SR)
        count = min(len(signal), n-index)
        if count <= 0 or index < 0:
            return
        mix[index:index+count, 0] += signal[:count]*volume*math.sqrt((1-pan)/2)
        mix[index:index+count, 1] += signal[:count]*volume*math.sqrt((1+pan)/2)

    def note(midi, length, kind='pluck'):
        t = np.arange(round(length*SR))/SR
        f = 440*2**((midi-69)/12)
        if kind == 'bass':
            sig = np.sin(2*np.pi*f*t) + .26*np.sin(4*np.pi*f*t)
            env = np.minimum(t/.008, 1)*np.exp(-t*6)
        else:
            sig = np.sin(2*np.pi*f*t) + .22*np.sin(4*np.pi*f*t) + .08*np.sin(6*np.pi*f*t)
            env = np.minimum(t/.005, 1)*np.exp(-t*10)
        return sig*env*np.minimum((length-t)/.025, 1)

    beat = .5
    roots = [48, 45, 41, 43]
    chords = [[60,64,67,71], [57,60,64,67], [53,57,60,64], [55,59,62,67]]
    melody = [76, 79, 74, 76, 72, 76, 79, 83, 81, 76, 72, 74, 79, 74, 71, 74]
    for k in range(math.ceil(duration/beat)):
        at = k*beat
        t = np.arange(int(.32*SR))/SR
        kick = np.sin(2*np.pi*(47*t + 3.7*(1-np.exp(-t*40))))*np.exp(-t*16)
        add(kick, at, .30)
        if k%2:
            t = np.arange(int(.16*SR))/SR
            noise = rng.normal(0, 1, len(t))
            noise -= np.roll(noise, 1)*.7
            add(noise*np.exp(-t*35), at, .055)
        for off in (0, .25):
            t = np.arange(int(.065*SR))/SR
            noise = rng.normal(0, 1, len(t)); noise -= np.roll(noise, 1)
            add(noise*np.exp(-t*70), at+off, .022 if off else .015, .35 if k%2 else -.35)
        chord = (k//4)%4
        add(note(roots[chord], .4, 'bass'), at, .19)
        if k%2 == 0:
            add(note(roots[chord]+12, .2, 'bass'), at+.375, .10)
        for j, m in enumerate(chords[chord]):
            add(note(m+12, .45), at+.25+j*.006, .055, (j-1.5)/4)
        if k%2 == 0:
            m = melody[(k//2)%len(melody)]
            add(note(m, .32), at, .095, -.20)
            add(note(m, .30), at+.17, .024, .35)
    mix *= np.minimum(1, np.arange(n)/(SR*.08))[:,None]
    mix *= np.minimum(1, (n-np.arange(n))/(SR*.5))[:,None]
    return mix


def write_audio(duration, short=False):
    voices = VOICES_15 if short else VOICES_30
    mix = music(duration)
    narration = np.zeros_like(mix)
    duck = np.ones(len(mix), np.float32)
    transcript = json.loads((VOICE/'voices.json').read_text())['lines']
    subtitles = []
    for at, maximum, key in voices:
        pcm = read_voice(key, maximum)
        start = round(at*SR)
        count = min(len(pcm), len(mix)-start)
        narration[start:start+count] += pcm[:count,None]
        a,b = max(0,start-int(.07*SR)), min(len(mix),start+count+int(.12*SR))
        duck[a:b] = .38
        subtitles.append((at, at+count/SR, transcript[key]))
    # ナレーション時はBGMを下げる。結果直前に短いブレイクを作る。
    mix *= duck[:,None]*.62
    suspense_start, suspense_end = (7,9) if short else (16.5,18.5)
    mix[int(suspense_start*SR):int(suspense_end*SR)] *= .15
    sfx_times = ([2.8,3.6,4.4,5.1,9] if short else [3.25,4.45,5.6,8.15,10.35,10.9,11.45,12.0,12.55,13.1,18.5,26.05])
    for at in sfx_times:
        tt = np.arange(int(.12*SR))/SR
        effect = np.sin(2*np.pi*(1300*tt-2100*tt**2))*np.exp(-tt*36)*.095
        i=round(at*SR); count=min(len(effect),len(mix)-i)
        mix[i:i+count] += effect[:count,None]
    # 結果に短い上昇音。
    for j,midi in enumerate([72,76,79,84]):
        tt=np.arange(int(.35*SR))/SR
        sig=np.sin(2*np.pi*(440*2**((midi-69)/12))*tt)*np.exp(-tt*10)*.065
        i=int((suspense_end+j*.065)*SR);count=min(len(sig),len(mix)-i)
        mix[i:i+count]+=sig[:count,None]
    full = mix+narration
    peak=float(np.max(np.abs(full)))
    full *= min(1, .93/max(peak,.001))
    name = f'type-checker-{int(duration)}s'
    raw_path=WORK/f'{name}-mix.wav'
    with wave.open(str(raw_path),'wb') as wav:
        wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(SR)
        wav.writeframes((full*32767).astype('<i2').tobytes())
    final_path=WORK/f'{name}-master.wav'
    subprocess.run([FFMPEG,'-v','error','-y','-i',str(raw_path),'-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar',str(SR),'-c:a','pcm_s16le',str(final_path)],check=True)
    def stamp(t):
        ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
    srt='\n\n'.join(f'{i+1}\n{stamp(a)} --> {stamp(b)}\n{line}' for i,(a,b,line) in enumerate(subtitles))+'\n'
    (OUT/f'{name}.srt').write_text(srt,encoding='utf-8')
    vtt='WEBVTT\n\n'+'\n\n'.join(f'{stamp(a).replace(",", ".")} --> {stamp(b).replace(",", ".")}\n{line}' for a,b,line in subtitles)+'\n'
    (OUT/f'{name}.vtt').write_text(vtt,encoding='utf-8')
    return final_path


def render_video(duration, short=False):
    name=f'type-checker-{int(duration)}s'
    audio=write_audio(duration,short)
    target=OUT/f'{name}.mp4'
    log=WORK/f'{name}-encode.log'
    args=[FFMPEG,'-y','-hide_banner','-loglevel','warning','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
          '-i',str(audio),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','21','-maxrate','5M','-bufsize','10M',
          '-pix_fmt','yuv420p','-profile:v','high','-level','4.1','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',
          '-c:a','aac','-b:a','192k','-ar',str(SR),'-movflags','+faststart','-t',str(duration),str(target)]
    with log.open('w') as handle:
        proc=subprocess.Popen(args,stdin=subprocess.PIPE,stderr=handle)
        try:
            for i in range(round(duration*FPS)):
                t=i/FPS
                im=frame_at(map_short(t) if short else t)
                proc.stdin.write(im.tobytes())
                if i%150==0:print(f'{name}: {i}/{round(duration*FPS)} frames',flush=True)
        finally:
            proc.stdin.close()
        if proc.wait()!=0:
            raise RuntimeError(log.read_text())
    if target.stat().st_size>=25*1024*1024:
        raise RuntimeError(f'Cloudflare Pagesの1ファイル上限を超えています: {target}')
    print(f'{target}: {target.stat().st_size/1024/1024:.2f} MiB',flush=True)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--preview',action='store_true')
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True);WORK.mkdir(parents=True,exist_ok=True)
    # 最初に静止画で構図を確認できるようにする。
    times=[1,3.7,7.1,8.9,11.5,14,17.3,19.5,21.5,24.5,27.7]
    sheet=Image.new('RGB',(360*4,640*3),'#e6dfd8')
    for i,t in enumerate(times):
        im=frame_at(t)
        im.save(WORK/f'frame-{t:.1f}.jpg',quality=92)
        sheet.paste(im.resize((360,640),Image.Resampling.LANCZOS),((i%4)*360,(i//4)*640))
    sheet.save(WORK/'contact-sheet.jpg',quality=93)
    frame_at(1).save(OUT/'type-checker-cover.jpg',quality=95,subsampling=0)
    if args.preview:return
    render_video(30)
    render_video(15,short=True)
    manifest={
        'title':'好きな顔、秒で選べる？', 'sourceSite':CAPTURE['site'],
        'captureDate':CAPTURE['capturedAt'], 'size':[W,H], 'fps':FPS,
        'edition':'2026-09-current-results',
        'results':{gender:{'code':s['resultCode'],'title':s['resultTitle'],'character':s['resultCharacter'],'examples':s['examplePortraits']} for gender,s in CAPTURE['sessions'].items()},
        'music':'今回のPV用にプログラムで作曲・合成したオリジナル音源。外部楽曲・サンプルなし。',
        'voice':json.loads((VOICE/'voices.json').read_text()),
        'shortEdits':CUTS,
        'files':{p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(OUT.iterdir()) if p.is_file() and p.suffix in {'.mp4','.srt','.vtt','.jpg','.txt'}},
    }
    (ROOT/'marketing/pv/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')


if __name__=='__main__':
    main()
