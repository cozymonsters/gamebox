# English GameBox

Classroom English vocabulary games. The teacher shows a game on the big screen; students join on their phones by scanning a QR code. No app or account needed.

**Play:** https://cozymonsters.github.io/gamebox/

## Games

| Game | Page | How it works |
|---|---|---|
| 🪢 Tug of War | `tug.html` | Two teams pull a rope. Every correct answer pulls it toward your side. |
| 🏀 Hoops | `hoops.html` | Correct answer = 2 pts, 3 in a row = 3-pointer, last 10 seconds = double points. |

## How to use

1. Teacher opens the GameBox homepage on the computer and picks a game.
2. Students scan the QR code or type the 4-digit room number on the homepage.
3. Students pick a team and answer 4-choice vocabulary questions.

Word sets: Sports, School Life, or the teacher's own list (one word per line, e.g. `coach 教練`).

## Files

- `index.html`: GameBox homepage (room join + game menu)
- `tug.html`, `hoops.html`: the games
- Live sync uses Firebase Realtime Database (`rooms/{code}`).

To add a new game: create `<id>.html`, store `meta.game = "<id>"` in its rooms, and add a card to the `GAMES` list in `index.html`.
