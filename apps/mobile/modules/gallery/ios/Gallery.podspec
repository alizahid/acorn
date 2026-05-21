Pod::Spec.new do |s|
  s.name             = 'Gallery'
  s.version          = '1.0.0'
  s.summary          = 'A sample project summary'
  s.description      = 'A sample project description'
  s.author           = 'Ali Zahid'
  s.homepage         = 'https://docs.expo.dev/modules/'
  s.platforms        = {
    :ios => '16.4',
    :tvos => '16.4'
  }
  s.source           = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.dependency 'HXPhotoPicker/Picker'
  s.dependency 'HXPhotoPicker/SDImageView'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
