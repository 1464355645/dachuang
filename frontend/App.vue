<script>
import { ensureMockLogin } from './api/user'

export default {
  onLaunch() {
    ensureMockLogin()
  }
}
</script>

<style lang="scss">
@import './styles/global.scss';
</style>
