'use strict'
const startButton = document.getElementById('start');
const mathArea = document.getElementById('math-area');
const stopButton = document.getElementById('stop');
const resultArea = document.getElementById('result-area');
const tweetArea = document.getElementById('tweet-area');

let correctAnswers = []; // 正解を作成
let numsOfCorrectAns = []; //　正解数カウントに使用
let comment = []; // それぞれの問題に正誤を表示
let settingNum = null; // 難易度に応じて四則演算で設定する数値の上限
let firstNum = null;　// 四則演算で使用する1つめの数値
let secondNum = null;　// 四則演算で使用する2つめの数値
const insects = ['かまきり', 'かぶと虫', 'くわがた', 'だんご虫', 'ちょうちょ', 'あり', '毛虫', 'くも', 'ミミズ', 'とんぼ', 'バッタ', 'アメンボ', 'カメムシ'];
let insect1 = null;　// 四則演算で使用する1種類目の虫
let insect2 = null;　// 四則演算で使用する2種類目の虫
let insect3 = null;　// 四則演算で使用する3種類目の虫
let fakeNum = null; // 問題を難しくするために使用し、計算には使用しない数値
let startingTime = null;
let elapsedTime = null;

// スタートボタンを押した時の処理
startButton.onclick = () => {
    clearInterval(elapsedTime);
    startingTime = new Date();
    startTime();
    correctAnswers.length = 0;
    numsOfCorrectAns.length = 0;
    comment.length = 0;
    stopButton.disabled = false;
    // 問題が重複しないように、既に問題がある場合は削除
    while (mathArea.firstChild) {
        mathArea.removeChild(mathArea.firstChild);
    }
    // 問題を3問作成
    const mathType = document.getElementById('mathChoice').group1.value;
    for (let i = 1; i <= 3; i++) {
        const quiz = document.createElement('p');
        //選択された四則演算を設定
        if (mathType === 'add') {
            quiz.innerText = addition();
        } else if (mathType === 'sub') {
            quiz.innerText = subtraction();
        } else if (mathType === 'mul') {
            quiz.innerText = multiplication();
        } else if (mathType === 'div') {
            quiz.innerText = division();
        }
        mathArea.appendChild(quiz);
        createBoxes();
    }
};

//　経過時間を表示
function showTime() {
    while (resultArea.firstChild) {
        resultArea.removeChild(resultArea.firstChild);
    }
    const showingTime = document.createElement('p');
    if (startingTime) {
        const now = new Date();
        const min = Math.floor(((now - startingTime) / 1000) / 60);
        const sec = (((now - startingTime) / 1000) % 60).toFixed(2);
        if (!min) {
            showingTime.innerText = `スタートから：${sec}秒`;
        } else {
            showingTime.innerText = `スタートから：${min}分${Math.floor(sec)}秒`;
        }
    }
    showingTime.style.fontSize = '1.5rem';
    showingTime.style.textAlign = 'right';
    showingTime.style.textDecoration = 'underline';
    showingTime.style.textDecorationColor ='#f19a3e';
    resultArea.appendChild(showingTime);
}

function startTime() {
    elapsedTime = setInterval(showTime, 80);
}

// ストップボタンを押した時の処理
stopButton.onclick = () => {
    // 各種ボタン、入力欄の無効化、時間をストップ
    clearInterval(elapsedTime);
    startButton.disabled = true;
    stopButton.disabled = true;
    const answerColumn = document.getElementById('math-area').getElementsByTagName('input');
    for (let i = 0; i < answerColumn.length; i++) {
        answerColumn[i].disabled = true;
    // 回答をチェックする
        const answer = Number(answerColumn[i].value);
        if (answer === correctAnswers[i]) {
            numsOfCorrectAns.push('good');
            comment.push(`${i + 1}問目せいかい！`);
        } else {
            comment.push(`${i + 1}問目まちがい。。。`);
        }
    }

    // 全問正解の場合とそれ以外で表示を変える
    const result = document.createElement('p');
    if (numsOfCorrectAns.length === answerColumn.length) {
        const congrats = [
            'パーフェクト！！',
            'Perfect!!',
            'すごい！ぜんもん正解！',
            'よくできました!',
            'てんさい！',
            'すごい！すごい！'
        ];
        result.innerText = `${congrats[createRandomNums(congrats.length)]} 今回の虫さんはこちら！！\nこの虫さんについてしらべてみよう！`;
        resultArea.appendChild(result);
        const insectPlace = document.createElement('div');
        const insectPic = document.createElement('img');
        insectPic.src = `${createRandomNums(43)}.jpg`; //写真の数を変更したらここの数値を変える
        insectPic.setAttribute('alt', '虫の画像');
        insectPic.setAttribute('width', '50%');
        insectPlace.appendChild(insectPic);
        resultArea.appendChild(insectPlace);
        tweetArea.style.display = 'block';

    } else {
        result.innerText = `${comment.join(' ')}\nおしい！ぜんもんせいかいすると良いことがあるかもよ！`;
        resultArea.appendChild(result);
    }

    // おなじ問題を再度回答
    const oneMoreButton = document.createElement('button');
    oneMoreButton.innerText = 'おなじもんだいにちょうせん！';
    resultArea.appendChild(oneMoreButton);
    oneMoreButton.onclick = () => {
        stopButton.disabled = false;
        numsOfCorrectAns.length = 0;
        comment.length = 0;
        for (let i = 0; i < answerColumn.length; i++) {
            answerColumn[i].disabled = false;
        }
        while (resultArea.firstChild) {
            resultArea.removeChild(resultArea.firstChild);
        }
    }
    // 違う問題を設定
    const newQuestionButton = document.createElement('button');
    newQuestionButton.innerText = '新しいもんだいにちょうせん！';
    resultArea.appendChild(newQuestionButton);
    newQuestionButton.onclick = () => {
        numsOfCorrectAns.length = 0;
        startButton.disabled = false;
        while (resultArea.firstChild) {
            resultArea.removeChild(resultArea.firstChild);
        }
    }
}

/**ランダムに数値を生成する
 * @param {number} num　生成する数値の上限
 */
function createRandomNums(num) {
    return Math.floor(Math.random() * num);
}
// 足し算を設定
function addition() {
    const difficulty = document.getElementById('level').group2.value;
    if (difficulty === 'intermediate') {
        settingNum = 20;
    } else if (difficulty === 'advanced') {
        settingNum = 100;
    }
    firstNum = createRandomNums(settingNum);
    secondNum = createRandomNums(settingNum);
    fakeNum = createRandomNums(settingNum) + 1; // 0を避ける
    insect1 = insects[createRandomNums(insects.length)];
    insect2 = insects[createRandomNums(insects.length)];
    insect3 = insects[createRandomNums(insects.length)];
    const questions = [
        `${insect1}が${firstNum}匹、${insect2}が${secondNum}匹います。ぜんぶで、虫は何匹ですか？`,
        `${insect3}が${fakeNum}匹いるところに、${insect2}が${secondNum}匹、${insect1}が${firstNum}匹あそびにきました。あそびにきた虫ははぜんぶ何匹ですか？`,
        `${firstNum}匹の${insect1}と、${fakeNum}匹のへびがおにごっこをしています。${secondNum}匹の${insect2}はえさをたべています。${insect1}とえさを食べている虫はあわせて何匹ですか？`,
        `${insect3}が${fakeNum}匹木の下にかくれています。${insect1}は池に${firstNum}匹、${insect2}は土の中に${secondNum}匹います。池と土の中には虫が何匹いますか？`,
        `${insect2}が${secondNum}匹、${insect1}が${firstNum}匹でつなひきをしています。${fakeNum}匹の${insect3}と${fakeNum + 3}匹のいなごは玉入れいます。つなひきをしているのはぜんぶ何匹ですか？`,
        `${firstNum}匹の${insect1}と${secondNum}匹の${insect2}は${fakeNum}このえさを食べています。虫はぜんぶ何匹ですか？`,
        `${insect1}はえさを${firstNum}こ、${insect3}はおもちゃを${fakeNum}こ、${insect2}はえさを${secondNum}こもっています。えさはぜんぶでなんこですか？`
    ];
    const question = questions[createRandomNums(questions.length)];
    correctAnswers.push(firstNum + secondNum);
    return question;
}
// 引き算を設定
function subtraction() {
    const difficulty = document.getElementById('level').group2.value;
    if (difficulty === 'intermediate') {
        settingNum = 10;
    } else if (difficulty === 'advanced') {
        settingNum = 50;
    }
    secondNum = createRandomNums(settingNum); // 引く数
    firstNum = secondNum + createRandomNums(settingNum);// 引かれる数
    fakeNum = createRandomNums(settingNum) + 1; // 0を避ける
    insect1 = insects[createRandomNums(insects.length)];
    insect2 = insects[createRandomNums(insects.length)];
    insect3 = insects[createRandomNums(insects.length)];
    const questions = [
        `${insect1}が${firstNum}匹、コガネムシが${secondNum}匹います。${insect1}はコガネムシより何匹おおいですか？`,
        `${fakeNum + 1}匹の${insect1}が、ぜんぶで${firstNum}こあったえさを${secondNum}こたべました。えさはあといくつありますか？`,
        `かくれんぼをしている${insect1}は${firstNum}匹います。かくれんぼでみつかった${insect1}は${secondNum}匹で、えさをたべている${insect1}は${fakeNum}匹です。まだかくれている${insect1}は何匹ですか？`,
        `${firstNum}匹の${insect1}と${fakeNum}匹のありじごくがおにごっこをしています。${insect1}は${secondNum}匹つかまっています。まだにげている${insect1}は何匹いますか？`,
        `${insect1}は子どもが${firstNum}匹、てんとう虫は子どもが${fakeNum}匹、ほたるはこどもが${secondNum}匹います。${insect1}はほたるより子どもが何匹多いですか？`,
        `${fakeNum}匹の${insect1}は${firstNum}このおもちゃをもっています。${fakeNum + 3}匹のコメツキ虫は${secondNum}このおもちゃをもっています。${insect1}はコメツキ虫よりいくつ多くのおもちゃをもっていますか？`,
        `${fakeNum}匹の${insect1}は1日のゲームの時間が${firstNum}分です。今日は${secondNum}分ゲームをしました。残りゲームはなん分ですか？`
    ];
    const question = questions[createRandomNums(questions.length)];
    correctAnswers.push(firstNum - secondNum);
    return question;
}
// 掛け算を設定
function multiplication() {
    const difficulty = document.getElementById('level').group2.value;
    if (difficulty === 'intermediate') {
        settingNum = 10;
    } else if (difficulty === 'advanced') {
        settingNum = 20;
    }
    firstNum = createRandomNums(settingNum);
    secondNum = createRandomNums(settingNum);
    fakeNum = createRandomNums(settingNum) + 1; // 0を避ける
    insect1 = insects[createRandomNums(insects.length)];
    insect2 = insects[createRandomNums(insects.length)];
    insect3 = insects[createRandomNums(insects.length)];
    const questions = [
        `${firstNum}匹の${insect1}がみんな${secondNum}こずつえさを持っています。えさはぜんぶでいくつですか？`,
        `${insect1}はおもちゃセットを${firstNum}こ、えさを${fakeNum}こもっています。おもちゃセットには${secondNum}こおもちゃが入っています。おもちゃはぜんぶでいくつですか？`,
        `${firstNum}匹の${insect1}はみんな${secondNum}分ゲームができます。${fakeNum}匹のはちはみんな${fakeNum + 3}分ゲームができます。${insect1}たちはぜんぶでなん分ゲームができますか？`,
        `${insect1}は1チーム${firstNum}匹で、${secondNum}チームつくりました。${insect1}はぜんぶで何匹いますか？`,
        `おかあさん${insect1}は${firstNum}匹のこどもにそれぞれ、${secondNum}このエサをあげます。えさはぜんぶでいくつひつようですか？`,
        `${insect1}はそれぞれ${firstNum}こいえがあり、${fakeNum}こくるまがあります。${insect1}が${secondNum}ひきいたら、いえはぜんぶでいくつあるでしょうか？`,
        `${insect1}は${firstNum}匹の子どもがいます。${insect1}の子供にはそれぞれ${secondNum}匹の子どもがいます。${insect1}はなん匹のまごがいるでしょうか？`
    ];
    const question = questions[createRandomNums(questions.length)];
    correctAnswers.push(firstNum * secondNum);
    return question;
}
// 割り算を設定
function division() {
    const difficulty = document.getElementById('level').group2.value;
    if (difficulty === 'intermediate') {
        settingNum = 9;
    } else if (difficulty === 'advanced') {
        settingNum = 19;
    }
    const correctAnswer = createRandomNums(settingNum) + 1; // 0を避ける
    correctAnswers.push(correctAnswer);
    firstNum = createRandomNums(settingNum) + 1; // 割る数・0を避ける
    secondNum = correctAnswer * firstNum; // 割られる数
    fakeNum = createRandomNums(settingNum) + 1; // 0を避ける
    insect1 = insects[createRandomNums(insects.length)];
    insect2 = insects[createRandomNums(insects.length)];
    insect3 = insects[createRandomNums(insects.length)];
    const questions = [
        `${firstNum}匹の${insect1}が${secondNum}このえさをみんなでわけます。${insect1}はそれぞれえさをいくつたべられますか？`,
        `${insect1}は${firstNum}匹、ツクツクボウシは${fakeNum}匹います。${secondNum}チームつくるとしたら、それぞれのチームに${insect1}はなん匹いますか？`,
        `${firstNum}匹の${insect1}は${fakeNum}分で${secondNum}こエサを見つけました。みんなでこうへいにわけると${insect1}はぞれぞれなんこエサをたべられますか？`,
        `${fakeNum}匹の${insect1}は友だちのいえまで、${firstNum}分でつかなければいけません。友だちのいえまでは${secondNum}mです。1分でなんmすすめばいいでしょうか？`,
        `${insect1}は${secondNum}匹います。1チーム${firstNum}匹でチームつくるとしたら、チームはいくつできますか？`,
        `${insect1}はぜんぶで${secondNum}こへやがあります。それぞれのいえには${firstNum}こへやがあり、${fakeNum}このトイレがあるとすると、いえはぜんぶでいくつありますか？`,
        `${secondNum}このおもちゃと${fakeNum}このおかしがあります。${insect1}の子ども${firstNum}ひきでおもちゃをわけると、${insect1}の子どもはそれぞれいくつおもちゃをもらえますか？`
    ];
    const question = questions[createRandomNums(questions.length)];
    return question;
}
// 回答欄を作成
function createBoxes() {
    const inputBox = document.createElement('input');
    inputBox.type = 'number';
    inputBox.style = 'height: 2.5rem; width: 5rem';
    inputBox.style.fontSize = '1.75rem';
    inputBox.style.fontFamily ='Times New Roman';
    const divRight = document.createElement('div');
    divRight.style.textAlign = 'right';
    divRight.appendChild(inputBox);
    mathArea.appendChild(divRight);
}
