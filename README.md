# Nederlandse Spraak App

Een Nederlandse spraakgestuurde desktop applicatie voor het openen van apps via spraakcommando's.

## Functies

- 🎤 Nederlandse spraakherkenning
- 🖥️ Cross-platform ondersteuning (Windows, Linux, macOS)
- 🎯 Eenvoudige interface met microfoon-icoon
- 📱 Responsive design
- 🔄 Recente commando's geschiedenis
- ⚠️ Foutafhandeling met handmatige invoer optie

## Installatie

1. Zorg ervoor dat Node.js is geïnstalleerd
2. Navigeer naar de project directory
3. Installeer dependencies:
   ```bash
   npm install
   ```

## Gebruik

1. Start de applicatie:
   ```bash
   npm start
   ```

2. Klik op het microfoon-icoon onderin de applicatie

3. Spreek de naam van een app uit die je wilt openen

4. De app zal proberen de applicatie te openen

## Ondersteunde Apps

### Windows
- Kladblok / Notepad
- Rekenmachine / Calculator
- Chrome, Firefox, Edge
- Verkenner / Explorer
- Opdrachtprompt / CMD
- PowerShell
- Taakbeheer / Task Manager
- Instellingen / Settings
- En veel meer...

### Linux
- Teksteditor / Gedit
- Rekenmachine / GNOME Calculator
- Firefox, Chrome
- Bestandsbeheer / Nautilus
- Terminal
- Systeemmonitor
- Instellingen / GNOME Control Center
- LibreOffice applicaties
- En veel meer...

### macOS
- TextEdit
- Calculator
- Safari, Chrome, Firefox
- Finder
- Terminal
- En veel meer...

## Voorbeelden van commando's

- "Teksteditor" - Opent de standaard teksteditor
- "Rekenmachine" - Opent de calculator
- "Firefox" - Opent Firefox browser
- "Terminal" - Opent de terminal
- "Instellingen" - Opent systeeminstellingen

## Foutafhandeling

Als een app niet wordt gevonden:
1. Er verschijnt een popup met wat de app hoorde
2. Je kunt handmatig de juiste naam typen
3. Klik op "Probeer" om het opnieuw te proberen

## Technische Details

- Gebouwd met Electron
- Gebruikt Web Speech API voor spraakherkenning
- Cross-platform app launching
- Nederlandse taal interface

## Ontwikkeling

Voor ontwikkelaars die de app willen aanpassen:

1. Clone de repository
2. Installeer dependencies: `npm install`
3. Start in development mode: `npm start`
4. Build voor distributie: `npm run dist`

## Systeemvereisten

- Node.js 16 of hoger
- Moderne browser met Web Speech API ondersteuning
- Microfoon toegang
- Internet verbinding (voor spraakherkenning)

## Licentie

Dit project is gemaakt door Manus AI Assistant.

