from boggle import Boggle

from flask import Flask, session, render_template, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app=Flask(__name__)
app.config["SECRET_KEY"] = "shhhh!!"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route("/")
def display_index():
    if not session.get("board", None):
        session["board"] = boggle_game.make_board()
    return render_template("gameboard.html")

@app.route("/word", methods=["POST"])
def test_word():
    req = request.get_json()
    word = req.get("word", None)
    board = session.get("board", None)
    retDict = {"word" : word}
    
    if not board:
        retDict["result"] = "err-no-board"
    elif word:
        retDict["result"] = boggle_game.check_valid_word(board, word)
    else:
        retDict["result"] = "not-word"
    
    return jsonify(retDict)