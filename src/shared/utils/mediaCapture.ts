const STORAGE_KEY = 'user_media_devices'
async function enumerateDevices() {
  try {
    const devices = sessionStorage.getItem(STORAGE_KEY)
      ? JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '')
      : await navigator.mediaDevices.enumerateDevices()

    if (!sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(devices))
    }
    alert(JSON.stringify(devices, null, 2))
    return { devices }
  } catch (error) {
    alert(JSON.stringify(error, null, 2))
    return { error }
  }
}
function getSupportedConstraints() {
  const constraints = navigator.mediaDevices.getSupportedConstraints()
  alert(JSON.stringify(constraints, null, 2))
}
async function getDisplayMedia(video: HTMLVideoElement | null) {
  if (!video) return
  const stream = await navigator.mediaDevices.getDisplayMedia()
  video.srcObject = stream
}

async function togglePictureInPicture(video: HTMLVideoElement | null) {
  if (!video) return
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture()
  } else {
    await video.requestPictureInPicture()
  }
}

async function getUserMedia(video: HTMLVideoElement | null) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  if (!video) return
  video.srcObject = stream
}

export {
  enumerateDevices,
  getDisplayMedia,
  getSupportedConstraints,
  getUserMedia,
  togglePictureInPicture,
}
