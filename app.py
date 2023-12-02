from boggle import Boggle

from flask import Flask, session, render_template
from flask_debugtoolbar import DebugToolbarExtension

app=Flask(__name__)
app.config["SECRET_KEY"] = "shhhh!!"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route("/")
def display_index():
    if not session.get("board"):
        session["board"] = boggle_game.make_board()
    return render_template("gameboard.html")