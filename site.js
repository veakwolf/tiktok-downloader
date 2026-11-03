const form = document.querySelector('.download-form');
if (form) {
  const input = form.querySelector('input[name="url"]');
  const feedback = document.querySelector('.form-feedback');
  const result = document.querySelector('.result-panel');
  const submit = form.querySelector('[type="submit"]');
  const paste = form.querySelector('.paste-button');

  input.addEventListener('input', () => {
    result.hidden = true;
    feedback.textContent = '';
    feedback.classList.remove('error');
  });

  paste.addEventListener('click', async () => {
    try {
      input.value = await navigator.clipboard.readText();
      input.dispatchEvent(new Event('input'));
      input.focus();
    } catch {
      feedback.textContent = 'Clipboard access is unavailable. Paste the link into the field.';
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    result.hidden = true;
    feedback.classList.remove('error');
    const match = input.value.match(/https?:\/\/[^\s]+/i);
    let link;
    try {
      link = new URL(match ? match[0] : input.value.trim());
      if (!/(^|\.)tiktok\.com$/i.test(link.hostname)) throw new Error('bad host');
    } catch {
      feedback.textContent = 'Enter a public TikTok video or story link.';
      feedback.classList.add('error');
      input.focus();
      return;
    }

    feedback.textContent = 'Finding available files…';
    submit.disabled = true;
    try {
      const api = new URL('https://www.tikwm.com/api/');
      api.searchParams.set('url', link.href);
      api.searchParams.set('hd', '1');
      const response = await fetch(api, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error('The media service did not respond. Try again shortly.');
      const payload = await response.json();
      if (payload.code !== 0 || !payload.data) throw new Error(payload.msg || 'No public media was found at that link.');
      renderResult(payload.data, form.dataset.mode, result);
      feedback.textContent = 'Choose a file below.';
      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      feedback.textContent = error.name === 'TimeoutError' ? 'The media service timed out. Please try again.' : error.message || 'The link could not be processed.';
      feedback.classList.add('error');
    } finally {
      submit.disabled = false;
    }
  });
}

function mediaUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, 'https://www.tikwm.com');
    return url.protocol === 'https:' ? url.href : null;
  } catch { return null; }
}

function renderResult(data, mode, panel) {
  panel.replaceChildren();
  const title = document.createElement('h2');
  title.textContent = data.title || 'Available downloads';
  panel.append(title);
  const grid = document.createElement('div');
  grid.className = 'result-grid';
  const cover = mediaUrl(data.cover || data.origin_cover);
  if (cover) {
    const image = document.createElement('img');
    image.src = cover;
    image.alt = 'TikTok post preview';
    grid.append(image);
  }
  const options = document.createElement('div');
  options.className = 'result-options';
  const files = [];
  const isPhotoPost = Array.isArray(data.images) && data.images.length > 0 && !data.duration;
  const hd = isPhotoPost ? null : mediaUrl(data.hdplay);
  const video = isPhotoPost ? null : mediaUrl(data.play);
  if (hd && hd !== video) files.push(['HD video', hd, 'video-hd.mp4']);
  if (video || hd) files.push(['Video MP4', video || hd, 'video.mp4']);
  if (Array.isArray(data.images)) data.images.forEach((image, index) => {
    const url = mediaUrl(image);
    if (url) files.push([`Photo ${index + 1}`, url, `photo-${index + 1}.jpg`]);
  });
  if (mode === 'stories') files.sort((a, b) => Number(b[0].startsWith('Photo')) - Number(a[0].startsWith('Photo')));
  if (!files.length) throw new Error('This post has no available download files.');
  files.forEach(([label, url, filename]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => saveFile(url, filename, button));
    options.append(button);
  });
  grid.append(options);
  panel.append(grid);
  const note = document.createElement('small');
  note.textContent = 'Quality and format depend on the public source. If your browser opens the file, use its Save option.';
  panel.append(note);
}

async function saveFile(url, filename, button) {
  const previous = button.textContent;
  button.textContent = 'Saving…';
  button.disabled = true;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error('file unavailable');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  } finally {
    button.textContent = previous;
    button.disabled = false;
  }
}
