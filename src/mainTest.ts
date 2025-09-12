import './app.css'
import App from './AppTest.svelte'

const app = new App({
  target: document.getElementById('app') ?? document.body,
})

export default app