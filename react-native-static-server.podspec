require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = package['name']
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']['name']
  s.homepage       = package['homepage']
  s.source         = { :git => 'https://github.com/futurepress/react-native-static-server.git' }

  s.requires_arc   = true
  s.platform       = :ios, '7.0'

  s.preserve_paths = 'README.md', 'package.json', 'index.js'
  s.source_files   = 'ios/*.{h,m}'

  s.dependency 'React'
  s.dependency 'GCDWebServer', '~> 3.0'
  s.dependency "GCDWebServer/WebUploader", "~> 3.0"
end
