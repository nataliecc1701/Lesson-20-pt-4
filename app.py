from boggle import Boggle

from flask import Flask, session, render_template, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension
import math

app=Flask(__name__)
app.config["SECRET_KEY"] = "shhhh!!"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route("/")
def display_index():
    session["board"] = boggle_game.make_board()
    num_games = session.get("games-played", 0)
    high_score = session.get("high-score", 0)
    return render_template("gameboard.html", numGames = num_games, highScore = high_score)

@app.route("/word", methods=["POST"])
def check_word():
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

@app.route("/stats", methods=["POST"])
def record_stats():
    req = request.get_json()
    
    games_played = session.get("games-played", 0) + 1
    high_score = max(session.get("high-score", 0), req.get("score", 0))
    
    # increment number of games played and the high score
    session["games-played"] = games_played
    session["high-score"] = high_score
    
    retDict = {
        "gamesPlayed" : games_played,
        "highScore" : high_score
    }
    
    return jsonify(retDict)