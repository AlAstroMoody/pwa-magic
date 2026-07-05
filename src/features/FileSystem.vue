<script setup lang="ts">
import { useApiGuard } from '@/shared/composables'
import { iActions, iApiFeature, iButton, iChapter, iInput } from '@/shared/ui'
import { dataURLtoFile } from '@/shared/utils'
import { ref } from 'vue'

const isSupported = ref('showOpenFilePicker' in window && 'showSaveFilePicker' in window)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard('FileSystem', isSupported)

const file = ref<File>()

async function getFile() {
  if (!guard()) return
  const [fileHandle] = await window.showOpenFilePicker!()
  file.value = await fileHandle.getFile()
}

const exampleFile = ref(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAAAJiS0dEAP+Hj8y/AAAAB3RJTUUH6AsOEzQ6wopCAQAAArtJREFUSMeN1U1oXFUUB/BfJjOZJmkSGtKmkjRqUdN0odQiFkShiDWgFZR+rAQVVBRFEOxCkC5cCdoquBIRCuIq1oUgFiylFBo3foEtjbY12pY0pTFtPpg4cXJdzHPy7sxkmnM37/zf+f/fveece16zetakeVUYmmqQjO322OycI84nWM5DdtvknM/95ha21yVBEJw2CFq8ZSrBfrS9MX2LsSQ0CD7Vgr1mUtjXOhsJvJMKDS7bqsOJCJv3eHzitLV7OPI3uMuQbRHW5oFGAn2Rn9NuQEfVLntXFgiWIn/JokxNpYorC8z6M/L/ccOUhSqBKysLLDgZ+TOuuGQ6wgrONKrCFhdSGT+p01rfRVX42cY0odye3Z4yLGfCNTk7E7TksFOK1tuVysqHjsm63x73mnIT+o0oCv52UKtOh8wKCj7TDQZ8X/n+UT3WOGBCEJxwN20+qbwueAmtHvOaJ1Md96BjJoz5QJ+MAwpJ/JKPecaN1Al/iKtcsS736JfFsOup+IscjVI0Z2ejHOuuSmkxY0cU0Jqcu2xNNW00XNXspawNEbCokDxl7fC0AZd9aVQJ5OzWEsWfV7np5XXNfSDvDZMJdtULScP1+CWKLnmXbyPolC40e91cCp00DHqjaRH8apB9qSoseRPsizIdBKMG0OabFFbwYjlth5US6Ljb8Kg/quhB8JE89ruZ+Ave01pOxDoHnTHuC1uxq2qbywV+RVbOc0b95bSXtadvxEa3W6PF85WRWrumvW9IRpc7rKszz+W9HY3PemvcIUMrddl+s7egl9dZj9Sj5321KnoQjMj/T8ukBPqt1jbVEyi6umqB8Zo5CZ41X7XVRXPm/VuFTnpimZRNCYzo9ao+WUXTxoz6yXXNemw26E7r5cw664jjy6S4mlmDtllr2u8umBFSndKhU1bBVPxf+A9xLYgp/fd66wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0xMS0xNFQxNjo1Mjo1OCswMzowMJDdZBEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMTEtMTRUMTY6NTI6NTgrMDM6MDDhgNytAAAAAElFTkSuQmCC',
)

async function saveFile(file: File | string) {
  if (!guard()) return
  const newHandle = await window.showSaveFilePicker!()
  const writableStream = await newHandle.createWritable()
  await writableStream.write(file)
  await writableStream.close()
}

function saveAsBase64() {
  saveFile(exampleFile.value)
}

function saveAsFile() {
  const savedFile = dataURLtoFile(exampleFile.value, 'icon.png')
  if (!savedFile) return
  saveFile(savedFile)
}
</script>

<template>
  <iApiFeature
    :is-supported="isSupported"
    :is-secure-context="isSecureContext"
    :requires-secure-context="requiresSecureContext"
    :api-name="meta.title"
    wrapper-class="file-system"
  >
    <iChapter>
      <div>Выбор файла</div>
      <iActions>
        <iButton @click="getFile">Выбрать файл</iButton>
      </iActions>
      <div v-if="file">Имя файла: {{ file.name }} | Размер: {{ file.size }} байт</div>
    </iChapter>

    <iChapter>
      <div>Сохранение файлов в выбранную директорию</div>
      <div>
        Имеется картинка <img width="32" height="32" :src="exampleFile" :key="exampleFile" />
      </div>
      <iInput v-model="exampleFile" label="можно изменить её в формате base64:" />
      <iActions>
        <iButton @click="saveAsBase64">Сохранить в base64</iButton>
        <iButton @click="saveAsFile">Сохранить как файл</iButton>
      </iActions>
      (не забудьте указать разрешение файла)
    </iChapter>
  </iApiFeature>
</template>

<style>
.file-system .api-input {
  max-width: 300px;
}
</style>
