# Flutter platform setup

This repo originally had only `lib/` and `pubspec.yaml`.

I added baseline folders for Android, iOS, Web, Linux, macOS and Windows so the app structure is complete in git.

Because Flutter SDK is not available in this container, some platform runner files are placeholders.

## Finalize on your machine

```bash
cd mobile_app
flutter doctor
flutter create . --platforms=android,ios,web,linux,macos,windows
flutter pub get
```

This command will keep your `lib/` code and regenerate fully buildable platform files.
