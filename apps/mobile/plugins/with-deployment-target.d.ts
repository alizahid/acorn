import { type ConfigPlugin } from 'expo/config-plugins'

type Props = {
  deploymentTarget?: string
}

declare const withIosDeploymentTarget: ConfigPlugin<Props | string | undefined>

export default withIosDeploymentTarget
