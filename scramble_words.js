#!/usr/bin/env node

const rl = require('readline').createInterface(process.stdin, process.stdout);
const data = require('./words.json').words;

var prompts = [
        '(user input) Take a guess',
        '(try again) Play again?'
    ],
    counter = 0,
    lives = 3,
    isNewWord = true,
    randomNumber,
    wordTobeGuessed = {},
    cacheWord = null,
    newScrambledWord = null;

rl.on('line', (line) => {
    line = line.toLowerCase();

    if (counter === prompts.length || line === 'no' || line === 'n') {
        return rl.close();
    }

    if (data.length === 0) {
        console.log('Good job. You guessed all words.');
        counter = prompts.length + 2;
        return rl.close();
    } else if (counter === 1) {
        if (line === 'yes' || line === 'y') {
            counter = 0;
            isNewWord = true;
        } else {
            // console.log('Enter either Yes/No (y/n)');
            counter = 1;
        }
    } else if (!line || !wordTobeGuessed.hasOwnProperty(line)) {
        lives -= 1;
        if (lives === 0) {
            console.log('(out of guesses) You Lost! The answer was: ' + Object.keys(wordTobeGuessed)[0]);
            counter = prompts.length + 2;
            return rl.close();
        } else {
            console.log('(wrong guess) Wrong! Ramining trys: ', lives);
            counter = 1;
        }
    } else if (line && wordTobeGuessed.hasOwnProperty(line) && line === Object.keys(wordTobeGuessed)[0]) {
        console.log('(right guess) You Won!');
        data.splice(randomNumber, 1);
        counter = 1;
        lives = 3;
    }

    get();

}).on('close', () => {
    console.log('Thanks for playing. Bye!');
});

function get() {
    if (isNewWord) {
        if (lives >= 0 && lives < 3) {
            console.log('(display word) Scrambled Word: ' + cacheWord);
        } else {
            lives = 3;
            cacheWord = null;
            cacheWord = getWord();
            console.log('(display word) Scrambled Word: ' + cacheWord);
        }

        isNewWord = false;
    }

    rl.setPrompt(prompts[counter] + ': ');
    rl.prompt();
}

get();

function setWordTobeGuessed(key, value) {
    wordTobeGuessed = {};
    wordTobeGuessed[key] = value;
}

function scrambleWord(word) {
    return word.split('').sort(() => {
        return 0.5 - Math.random();
    }).join('');
}

function getWord() {
    randomNumber = Math.floor(Math.random() * data.length);
    let sWord = scrambleWord(data[randomNumber]);

    setWordTobeGuessed(data[randomNumber], sWord);

    return sWord;
}

