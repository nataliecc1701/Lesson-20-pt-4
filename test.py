from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    
    # TODO -- write tests for every view function / feature!
    
    # test cases for index route:
    # test that the board is created when it should be
    # test that the form is displayed
    ''''''
    
    # test cases for words route:
    # valid word
    # non word
    # not on board
    # empty string
    # no board
    
    # test cases for stats route
    # lower than previous high score
    # equal to previous high score
    # greater than previous high score
    # test that games played increments (all cases)
    # test with bad input