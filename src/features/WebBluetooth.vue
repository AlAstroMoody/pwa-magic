<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { showError } from '@/shared/utils'
import { ref } from 'vue'

const isSupported = ref('bluetooth' in navigator)
const indicator = ref<number>(0)
async function scan() {
  const connectToDevice = async ({
    bleService,
    bleCharacteristic,
  }: {
    bleService: string
    bleCharacteristic: string
  }) => {
    try {
      if (!navigator.bluetooth) return
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [bleService],
          },
        ],
      })

      device.addEventListener('gattserverdisconnected', () => {
        indicator.value = 0
      })

      const server = await device.gatt.connect()
      const service = await server.getPrimaryService(bleService)
      const characteristic = await service.getCharacteristic(bleCharacteristic)
      await characteristic.startNotifications()

      characteristic.addEventListener('characteristicvaluechanged', (e: Event) => {
        const event = e as CharacteristicValueChangeEvent
        const value = event.target.value.getUint8(0)

        console.log(`${bleCharacteristic} changed`, value)

        indicator.value = value
      })

      characteristic.readValue()

      return characteristic
    } catch (error) {
      alert(`Ошибка: ${showError(error)}`)
    }
  }

  await connectToDevice({ bleService: 'battery_service', bleCharacteristic: 'battery_level' })
}
</script>

<template>
  <div v-if="!isSupported">Не поддерживается устройством</div>
  <div v-else>
    <iButton @click="scan">scan</iButton>
    <div v-if="indicator">Уровень заряда устройства: {{ indicator }}</div>
  </div>
</template>
