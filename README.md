Directory Index Media Player (DIMPL)
====================================

[Directory Index Media Player (DIMPL)][download] is a Google Chrome App (or standalone application) that lets you 
stream music from your web server or local media library.

## Features

- Plays all of the audio and video formats that Google Chrome supports.
- Remembers your playlist and settings.
- Comprehensive keyboard shortcuts.
- Minimal, fast, easy.

![Screenshot][screenshot-image]

## Instructions

#### Local files

- Click the menu button in the top-left of the DIMPL window.
- Select the "Local" tab.
- Click "Browse" and navigate to the root of your media library.

#### Web files

- Make your media directory accessible from the web.
- Enable your web server's automatic directory indexes.
- Click the menu button in the top-left of the DIMPL window.
- Select the "Web" tab.
- Enter your media directory's web-address.

#### Example Nginx configuration:

```
location /music {
	root /media/stuff/;
	autoindex on;
	# Optional CORS headers.
	# Omit the "always" argument for for nginx < 1.7.5.
	add_header 'Access-Control-Allow-Credentials' 'true' always;
	add_header 'Access-Control-Allow-Origin' $http_origin always;
}
```

[Nginx documentation][docs-nginx]

#### Example Apache HTTP server configuration:

```
<Directory "/media/stuff/music">
    Options +Indexes
	# Optional CORS header.
    Header always set Access-Control-Allow-Origin "*"
</Directory>
```

[Apache documentation][docs-apache]

## Keyboard shortcuts

Keys|Description
---|---
← or h|Play the previous file.
ctrl ← or ctrl h|Play the 10th previous file.
alt ← or alt h|Play the first file.
→ or l|Play next file.
ctrl → or ctrl l|Play the 10th next file.
alt → or alt l|Play the last file.
shift h or shift ←|Rewind 5%.
shift l or shift →|Fast-forward 5%.
↑ or k|Highlight the previous file or directory.
ctrl ↑ or ctrl k|Highlight the 10th previous file or directory.
alt ↑ or alt k|Highlight the first file or directory.
↓ or j|Highlight the next file or directory.
ctrl ↓ or ctrl j|Highlight the 10th next file or directory.
alt ↓ or alt j|Highlight the last file or directory.
g|Scroll to the top of the window.
shift g|Scroll to the bottom of the window.
backspace or b|Navigate to the previous directory.
ctrl backspace or ctrl b|Navigate to the root directory.
enter or f|Navigate to the highlighted directory or add the highlighted file to the playlist.
a|Add all files to the playlist.
m or o|Display or hide the configuration form.
/|Focus the filter input field and scroll to the top of the window.
esc|If the filter input field is focused, then defocus it, otherwise clear it.
space or p|Toggle play or pause.
c or ctrl x|Clear the playlist.
x|Remove the current song from the playlist.
s or t|Toggle shuffle.

## Standalone application

DIMPL can also be built into an [Electron][electron] package and then installed as a standalone application.

```
$ npm install && gulp dist-electron && ls dist/*/ -1 |grep zip
dimpl-0.4.1-darwin-x64.zip
dimpl-0.4.1-linux-ia32.zip
dimpl-0.4.1-linux-x64.zip
dimpl-0.4.1-win32-ia32.zip
dimpl-0.4.1-win32-x64.zip
```

Each of these zip archives contains an executable named either dimpl (linux), Dimpl.app (mac) or dimpl.exe (windows).

You can also download pre-built packages from the [releases page][releases].

## FAQ

<dl>
  <dt><em>Can I make my media directory more private?</em></dt>
  <dd>You can use <a href="http://en.wikipedia.org/wiki/Basic_access_authentication">HTTP Basic Authentication</a> over 
  SSL to secure your media directory. You can include your login credentials in the "Directory index web-address" field in DIMPL. eg.``https://USER:PASSWORD@example.com/media``</dd>
  
  <dt><em>What audio formats are supported?</em></dt>
  <dd>.aac, .mp3, .oga, .ogg, .opus, .wav, .weba</dd>

  <dt><em>What video codecs are supported?</em></dt>
  <dd>.ogv (Ogg Theora), .mp4 (H.264), .webm (vp8/vp9)</dd>
  
  <dt><em>Is there any way to play other audio formats such as FLAC?</em>
  <dd>You can use the <a href="https://github.com/khenriks/mp3fs">mp3fs FUSE filesystem</a> to transcode FLAC to MP3 on 
  the fly.</em>
  
  <dt><em>What internet protocols are supported?</em>
  <dd>HTTP and HTTPS</dd>
</dl>

## Contributing

Contributions of any sort are welcome.

## License

[MIT][license].

[docs-apache]: https://wiki.apache.org/httpd/DirectoryListings#Directory_Listings
[docs-nginx]: http://nginx.org/en/docs/http/ngx_http_autoindex_module.html
[download]: https://chrome.google.com/webstore/detail/directory-index-media-pla/bcanaaidccjjjigbdiegafllllpbgkdg
[electron]: https://github.com/atom/electron
[license]: /LICENSE
[releases]: https://github.com/andornaut/dimpl/releases
[screenshot-image]: /resources/screenshot-0.png
