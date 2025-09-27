Pod::Spec.new do |s|
    s.name                = 'ffmpeg-kit-ios-full-gpl'
    s.version             = '6.0'
    s.summary             = 'Custom full-gpl FFmpegKit iOS frameworks from self-hosted source.'
    s.homepage            = 'https://github.com/arthenica/ffmpeg-kit'
    s.license             = { :type => 'LGPL' }
    s.author              = { 'Ali' => 'ali.zahid@live.com' }
    s.platform            = :ios, '15.1'
    s.static_framework    = true

    s.source              = { :http => 'https://github.com/NooruddinLakhani/ffmpeg-kit-ios-full-gpl/archive/refs/tags/latest.zip' }

    s.vendored_frameworks = [
      'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libswscale.xcframework',
      'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libswresample.xcframework',
      'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavutil.xcframework',
      'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavformat.xcframework',
      'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavfilter.xcframework',
      'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavdevice.xcframework',
      'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/libavcodec.xcframework',
      'ffmpeg-kit-ios-full-gpl-latest/ffmpeg-kit-ios-full-gpl/6.0-80adc/ffmpegkit.xcframework'
    ]
end
