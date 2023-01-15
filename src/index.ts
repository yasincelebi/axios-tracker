import './style.css'
import typescriptLogo from './typescript.svg'

import axios from "axios";
import axiosTracker from "./axiosTracker";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
// create axios
const axiosInstance = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 1000,
    headers: {"X-Custom-Header": "foobar"},

// write plugin
});
const tracker = axiosTracker(axiosInstance, (data) => {
    console.log(data);
})

// use axios
tracker.get("/tods/1", {'axios-tracker': {track: true}}).then((response) => {
   return response
})



