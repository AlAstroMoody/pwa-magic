<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { ref } from 'vue'

const toast = useToast()
const isSupported = ref('bluetooth' in navigator)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard('WebBluetooth', isSupported)
const indicator = ref<number>(0)

async function scan() {
  if (!guard()) return

  try {
    if (!navigator.bluetooth) return

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['battery_service'] }],
    })

    device.addEventListener('gattserverdisconnected', () => {
      indicator.value = 0
    })

    const server = await device.gatt!.connect()
    const service = await server.getPrimaryService('battery_service')
    const characteristic = await service.getCharacteristic('battery_level')
    await characteristic.startNotifications()

    characteristic.addEventListener('characteristicvaluechanged', (e: Event) => {
      const event = e as CharacteristicValueChangeEvent
      indicator.value = event.target.value.getUint8(0)
    })

    characteristic.readValue()
  } catch (error) {
    toast.error(error)
  }
}
</script>

<template>
  <iApiFeature
    :is-supported="isSupported"
    :is-secure-context="isSecureContext"
    :requires-secure-context="requiresSecureContext"
    :api-name="meta.title"
  >
    <iActions>
      <iButton @click="scan">scan</iButton>
    </iActions>
    <div v-if="indicator">Уровень заряда устройства: {{ indicator }}</div>
  </iApiFeature>
</template>
