import './app.css'
import App from './AppWebAuth.svelte'

const app = new App({
  target: document.getElementById('app') ?? document.body,
})

export default app