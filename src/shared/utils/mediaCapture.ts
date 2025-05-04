import { showError } from "./error";

const STORAGE_KEY = 'user_media_devices'

async function enumerateDevices(): Promise<{ devices?: MediaDeviceInfo[]; error?: Error }> {
  try {
    let devices: MediaDeviceInfo[]
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      devices = JSON.parse(stored)
    } else {
      devices = await navigator.mediaDevices.enumerateDevices()
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(devices))
    }
    return { devices }
  } catch (error) {
    return { error: error as Error }
  }
}

function getSupportedConstraints(): MediaTrackSupportedConstraints {
  return navigator.mediaDevices.getSupportedConstraints()
}

async function getDisplayMedia(video: HTMLVideoElement | null): Promise<MediaStream | null> {
  if (!video) {
    return null
  }
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia()
    video.srcObject = stream
    return stream
  } catch (error) {
    console.error('Get display media error:', error)
    throw error
  }
}

async function togglePictureInPicture(video: HTMLVideoElement | null) {
  if (!video) {
    return
  }
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else {
      if (video.paused) {
        await video.play()
      }
      await video.requestPictureInPicture()
    }
  } catch (error) {
    alert(`Ошибка PiP: ${showError(error)}`)
  }
}

async function getUserMedia(
  video: HTMLVideoElement | null,
  constraints: MediaStreamConstraints = { video: true, audio: true },
): Promise<MediaStream | null> {
  if (!video) {
    return null
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.srcObject = stream
    return stream
  } catch (error) {
    console.error('Get user media error:', error)
    throw error
  }
}

export {
  enumerateDevices,
  getDisplayMedia,
  getSupportedConstraints,
  getUserMedia,
  togglePictureInPicture,
}
