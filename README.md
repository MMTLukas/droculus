# Droculus - kurze Projektbeschreibung

Beim studentischen Projekt Droculus geht es darum, eine Drohne autonom einem Nutzer via Marker-Tracking folgen zu lassen. Der Nutzer kann dabei die Welt aus der Perspective der Drohne über deren Front-Kamera wahrnehmen.

# Repository - Inhalt

In diesem Repository befindet sich sämtlicher Source-Code, der für das Droculus-Projekt benötigt wird. 


Das Repository selbst ist in zwei Hauptordner unterteilt:

- tracking: In diesem Ordner befindet sich sämtlicher source-Code, der für das Marker-Tracking benötigt wird.

- flying: Sämtlicher Source-Code der für das autonome Fliegen der Drohne und den damit verbundenen zusätzlichen Features des Kopftrackings und des Live-Streamings des Kamerabildes auf der Oculus, benötigt wird, ist hierin enthalten.


Daneben befinden sich die beiden yml-Files mit den Kalibrierungswerten für die beiden Kameras der Parrot AR Drone 2.0 in diesem Repository, genauso wie der eingesetzte Marker. Diese Files können im Ordner "tracking" und dort im Unterordner "assets" gefunden werden.