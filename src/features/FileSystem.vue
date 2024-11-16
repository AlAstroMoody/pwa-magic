<script setup lang="ts">
import { dataURLtoFile } from '@/shared/utils'
import { ref } from 'vue'

const file = ref()
async function getFile() {
  if (!window.showOpenFilePicker) return
  const [fileHandle] = await window.showOpenFilePicker()
  file.value = await fileHandle.getFile()
  return file.value
}

const exampleFile = ref(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAAAJiS0dEAP+Hj8y/AAAAB3RJTUUH6AsOEzQ6wopCAQAAArtJREFUSMeN1U1oXFUUB/BfJjOZJmkSGtKmkjRqUdN0odQiFkShiDWgFZR+rAQVVBRFEOxCkC5cCdoquBIRCuIq1oUgFiylFBo3foEtjbY12pY0pTFtPpg4cXJdzHPy7sxkmnM37/zf+f/fveece16zetakeVUYmmqQjO322OycI84nWM5DdtvknM/95ha21yVBEJw2CFq8ZSrBfrS9MX2LsSQ0CD7Vgr1mUtjXOhsJvJMKDS7bqsOJCJv3eHzitLV7OPI3uMuQbRHW5oFGAn2Rn9NuQEfVLntXFgiWIn/JokxNpYorC8z6M/L/ccOUhSqBKysLLDgZ+TOuuGQ6wgrONKrCFhdSGT+p01rfRVX42cY0odye3Z4yLGfCNTk7E7TksFOK1tuVysqHjsm63x73mnIT+o0oCv52UKtOh8wKCj7TDQZ8X/n+UT3WOGBCEJxwN20+qbwueAmtHvOaJ1Md96BjJoz5QJ+MAwpJ/JKPecaN1Al/iKtcsS736JfFsOup+IscjVI0Z2ejHOuuSmkxY0cU0Jqcu2xNNW00XNXspawNEbCokDxl7fC0AZd9aVQJ5OzWEsWfV7np5XXNfSDvDZMJdtULScP1+CWKLnmXbyPolC40e91cCp00DHqjaRH8apB9qSoseRPsizIdBKMG0OabFFbwYjlth5US6Ljb8Kg/quhB8JE89ruZ+Ave01pOxDoHnTHuC1uxq2qbywV+RVbOc0b95bSXtadvxEa3W6PF85WRWrumvW9IRpc7rKszz+W9HY3PemvcIUMrddl+s7egl9dZj9Sj5321KnoQjMj/T8ukBPqt1jbVEyi6umqB8Zo5CZ41X7XVRXPm/VuFTnpimZRNCYzo9ao+WUXTxoz6yXXNemw26E7r5cw664jjy6S4mlmDtllr2u8umBFSndKhU1bBVPxf+A9xLYgp/fd66wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0xMS0xNFQxNjo1Mjo1OCswMzowMJDdZBEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMTEtMTRUMTY6NTI6NTgrMDM6MDDhgNytAAAAAElFTkSuQmCC',
)
async function saveFile(file: File | String) {
  if (!window.showSaveFilePicker) return
  const newHandle = await window.showSaveFilePicker()
  const writableStream = await newHandle.createWritable()
  await writableStream.write(file)
  await writableStream.close()
}

function saveAsBase64() {
  saveFile(exampleFile.value)
}

function saveAsFile() {
  const file = dataURLtoFile(exampleFile.value, 'icon.png')
  if (!file) return
  saveFile(file)
}
</script>
<template>
  <div id="file-system">
    <div class="chapter">
      <div>Выбор файла</div>
      <button @click="getFile">Выбрать файл</button>
      <div v-if="file">Имя файла: {{ file.name }} | Размер: {{ file.size }} байт</div>
    </div>
    <div class="chapter">
      <div>Сохранение файлов в выбранную директорию</div>
      <div>
        Имеется картинка <img width="32" height="32" :src="exampleFile" :key="exampleFile" />
      </div>
      <label class="label">
        <span>можно изменить её в формате base64:</span>
        <br />
        <input v-model="exampleFile" class="input" />
      </label>

      <div class="buttons">
        <button @click="saveAsBase64">Сохранить в base64</button>
        <button @click="saveAsFile">Сохранить как файл</button>
      </div>
      (не забудьте указать разрешение файла)
    </div>
  </div>
</template>
<style scoped>
#file-system .chapter {
  margin-bottom: 16px;
  padding: 0 0 8px;
  border-bottom: var(--vt-c-divider-light-2) 2px solid;
}

#file-system .label {
  display: block;
  margin-bottom: 16px;
}

#file-system .label .input {
  width: 100%;
  max-width: 300px;
}

#file-system .buttons {
  display: flex;
  gap: 8px;
}
</style>
