/// <reference types="vite/client" />
interface ContactInfo {
  address: Array<ContactAddress>
  email: Array<string>
  icon: Blob
  name: Array<string>
  tel: Array<string>
}

interface Navigator {
  share?: (data?: ShareData) => Promise<void>
  contacts: {
    getProperties: () => Promise<void>
    requestPermission: () => Promise<string>
    select: (
      properties: ContactProperty[],
      options?: ContactsSelectOptions,
    ) => Promise<ContactInfo[]>
  }
  bluetooth?: Bluetooth
}

interface BarcodeDetector {
  detect(image: ImageBitmapSource): Promise<{ rawValue: string }[]>
}

type BarcodeDetectorConstructor = {
  new (options?: { formats: string[] }): BarcodeDetector
}

interface Window {
  showOpenFilePicker?: () => Promise<[fileHandle]>
  showSaveFilePicker?: () => Promise<{
    createWritable: () => Promise<{
      write: (file: File | string) => Promise<void>
      close: () => Promise<void>
    }>
  }>
  SpeechRecognition: new () => SpeechRecognition
  webkitSpeechRecognition: new () => SpeechRecognition
  BarcodeDetector: BarcodeDetectorConstructor
}

interface Bluetooth {
  requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>
}

interface RequestDeviceOptions {
  filters?: BluetoothLEScanFilter[]
  optionalServices?: BluetoothServiceUUID[]
}

interface BluetoothLEScanFilter {
  services?: BluetoothServiceUUID[]
  name?: string
  namePrefix?: string
}

type BluetoothServiceUUID = string | number

interface CharacteristicValueChangeEvent extends Event {
  target: BluetoothRemoteGATTCharacteristic
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList
  readonly resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown) | null
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null
  start(): void
  stop(): void
}
