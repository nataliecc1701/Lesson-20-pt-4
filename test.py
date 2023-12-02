from unittest import TestCase
from app import app
from flask import session, jsonify
from boggle import Boggle


# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

# prefab board used for tests that involve a board
TESTING_BOARD = [
                ["A", "B", "C", "D", "E"],
                ["F", "G", "H", "I", "K"],
                ["L", "M", "N", "O", "P"],
                ["Q", "R", "S", "T", "U"],
                ["V", "W", "X", "Y", "Z"],
            ]

class FlaskTests(TestCase):
    
    # TODO -- write tests for every view function / feature!
    def test_index_route(self):
        '''tests for index route:
        - test that the board is created when it should be
        - test that the page heading is correct
        '''
        with app.test_client() as client:
            resp = client.get("/")
            html = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Boggle</h1>", html)
            self.assertTrue(session["board"]) # checks that the board was created
    
    # test cases for words route:
    # valid word, non word, not on board, empty string, no board
    
    def test_words_no_board(self):
        with app.test_client() as client:
            resp = client.get("/word?word=dazzle")
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn("err-no-board", json)
    
    def test_words_empty_string(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["board"] = TESTING_BOARD
                
            resp = client.get("/word")
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn("not-word", json)
            
    def test_words_valid(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["board"] = TESTING_BOARD
                
            resp = client.get("/word?word=bag")
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn("ok", json)
    
    def test_words_absent(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["board"] = TESTING_BOARD
                
            resp = client.get("/word?word=gin")
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn("not-on-board", json)
    
    def test_words_not_word(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["board"] = TESTING_BOARD        
                
            resp = client.get("/word?word=abcde")
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn("not-word", json)
    
    # test cases for stats route
    # no previous high score
    # lower than previous high score
    # greater than previous high score
    # bad input
    #
    # tests each case:
    # does the games played increment?
    # is the high score correct
    
    def test_stats_no_previous(self):
        with app.test_client() as client:
            resp = client.post("/stats", json = {"score" : 10})
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn('"gamesPlayed": 1', json)
            self.assertIn('"highScore": 10', json)
            
    def test_stats_lower_than_previous(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["high-score"] = 50
                change_session["games-played"] = 1
            
            resp = client.post("/stats", json = {"score" : 10})
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn('"gamesPlayed": 2', json)
            self.assertIn('"highScore": 50', json)
            
    def test_stats_greater_than_previous(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["high-score"] = 50
                change_session["games-played"] = 2
            
            resp = client.post("/stats", json = {"score" : 55})
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn('"gamesPlayed": 3', json)
            self.assertIn('"highScore": 55', json)
            
    def test_stats_equal_to_previous(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["high-score"] = 55
                change_session["games-played"] = 3
            
            resp = client.post("/stats", json = {"score" : 55})
            json = resp.get_data(as_text=True)
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn('"gamesPlayed": 4', json)
            self.assertIn('"highScore": 55', json)