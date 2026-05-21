const fs = require('node:fs/promises')
const path = require('node:path')

const { withDangerousMod } = require('expo/config-plugins')

const tag = 'force-ios-deployment-target'
const begin = `# @generated begin ${tag}`
const end = `# @generated end ${tag}`

const reactNativePostInstall =
  /(\n\s+react_native_post_install\([\s\S]*?\n\s+\)\n)/

function createPodfileBlock(deploymentTarget) {
  return `  ${begin}
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |build_configuration|
      build_configuration.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${deploymentTarget}'
    end
  end
  ${end}`
}

function withIosDeploymentTarget(config, props) {
  const deploymentTarget =
    typeof props === 'string'
      ? props
      : (props?.deploymentTarget ?? config.ios?.deploymentTarget ?? '16.4')

  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile',
      )
      const block = createPodfileBlock(deploymentTarget)
      const podfile = await fs.readFile(podfilePath, 'utf8')

      const existingBlock = new RegExp(
        `^[ \\t]*${begin}[\\s\\S]*?^[ \\t]*${end}\\n?`,
        'm',
      )
      if (existingBlock.test(podfile)) {
        await fs.writeFile(
          podfilePath,
          podfile.replace(existingBlock, `${block}\n`),
        )
        return config
      }

      if (!reactNativePostInstall.test(podfile)) {
        throw new Error(
          `Could not find react_native_post_install in ${podfilePath}`,
        )
      }

      await fs.writeFile(
        podfilePath,
        podfile.replace(reactNativePostInstall, `$1\n${block}\n`),
      )

      return config
    },
  ])
}

module.exports = withIosDeploymentTarget
