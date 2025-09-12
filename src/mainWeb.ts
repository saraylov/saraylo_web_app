import './app.css'
import App from './AppWeb.svelte'

const app = new App({
  target: document.getElementById('app') ?? document.body,
})

export default app