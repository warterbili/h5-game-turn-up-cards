var startbtn = document.getElementById('start')
// 游戏难度参数
var numberOfCards 
// 设置游戏时长
var time
// 设置点击次数
var click 

var ele
var timeRemaining = document.getElementById('timeRemaining')
var clickCount =document.getElementById('clickCount')


startbtn.addEventListener('click',function(){
    if(numberOfCards){
    //  document.querySelector('.game-title').style.display = 'none'
    // 隐藏一部分元素只保留卡牌元素
     document.querySelector('.start').style.display = 'none'
     document.querySelector('.level').style.display = 'none'
     document.querySelector('.set').style.display = 'none'
     document.querySelector('.game-info-container').style.display = 'flex'
    //  设计了一个类负责生成卡牌数和随机排列卡牌
     class CardGame {

        constructor(numberOfCards) {   
            //传递难度参数 8 16 24 
            this.container = document.querySelector('#game-container');
            this.numberOfCards = numberOfCards//难度系数
            this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Q', 'J', 'K', 'A']
            this.suits = ['♠', '♦', '♣', '♥']
    
        }
    
        // 卡牌设置函数，用于设置卡牌的属性来批量生成卡牌
        createCardElement() {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-number', '');
            card.setAttribute('data-turn', 'back');
    
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back card-face';
    
            
            ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(position => {
                const cobweb = document.createElement('img');
                cobweb.className = `cobweb cobweb-${position}`;
                cobweb.src = '../image/Cobweb.png';
                cardBack.appendChild(cobweb);
            });
    
            const spider = document.createElement('img');
            spider.className = 'spider';
            spider.src = '../image/Spider.png';
            cardBack.appendChild(spider);
    
            card.appendChild(cardBack);
    
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front card-face';
    
            const cardValue = document.createElement('div');
            cardValue.className = 'card';
    
            cardValue.setAttribute('data-value','');
            cardValue.innerHTML = '';
    
            cardFront.appendChild(cardValue);
            card.appendChild(cardFront);
    
            return card;
        }
    
        // 生成卡牌函数，调用这个方法来生成卡牌
        generateCards() {
            for (let i = 0; i < this.numberOfCards; i++) {
                const card = this.createCardElement();
                this.container.appendChild(card);
            }
        }

        // 洗牌算法函数，用于随机生成卡牌
        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    
        // 生成一个乱序一维卡牌数组
        ran(){
            let x = (this.numberOfCards)/2 
            let values = this.values
            let suits = this.suits
            // 生成二维有数卡牌数组，罗列所有卡牌
            const result = values.map(value => {
                return suits.map(suit => {   
                    return value + suit;
                });
            });
    
            const selectedSubArrays = this.shuffle(result).slice(0, x);
            let valuesToPick = [];
            // 从选中的二维数组中再次选两个值
            selectedSubArrays.forEach(subArray => {
                const shuffledSubArray = this.shuffle(subArray);
                valuesToPick.push(shuffledSubArray.slice(0, 2));
            });
            // 生成扁平一维数组
            const oneDArray = valuesToPick.flat();
            // 获得乱序以为卡牌数组
            const finalShuffledArray = this.shuffle(oneDArray);
    
            return finalShuffledArray
        }
    
    }
    
    //实例化，参数是难易度
    const cardGame = new CardGame(numberOfCards);  
    // 生成卡牌
    cardGame.generateCards();
    // 生成乱序卡牌数字
    var shuzu = cardGame.ran();
    // 合并生成完整卡牌
    let alond = document.querySelectorAll('.card-front.card-face>.card')
    for(let i =0;i<alond.length;i++){
        let a = shuzu[i]
        alond[i].setAttribute('data-value',`${a}`);
        alond[i].innerHTML = `${a.slice(a.length-1)}`;
        // console.log(a.slice(a.length-1))
        if(a.slice(a.length-1)=='♥'||a.slice(a.length-1)=='♦'){
            alond[i].className = 'card red'
        }else{
            alond[i].className = 'card black'
        }
    }
// 获取用于点击交互的元素
var ele = document.querySelectorAll('.card:not(.black):not(.red)')
//为每个卡牌添加点击事件
for(let i=0;i<ele.length;i++){
    let a = shuzu[i]
    ele[i].setAttribute('data-number', `${a.slice(0, a.length-1)}`)
    // 这里不能用event.target，会冒泡到子元素上，只能用this
    ele[i].addEventListener('click',function(){
        handlerClick(this)
    })
}



// 将点击选中的卡牌放入数组中
let cardsChosen = []
// 如果有相同的卡牌那么将其隐藏,隐藏的卡牌放入这个数组中
let cardsHidden = []
// 为倒计时设置定时器
let t = setInterval(()=>{
    time--
    timeRemaining.innerHTML = time
    if(time==0){
        timeRemaining.innerHTML = time
        clearInterval(t)
        if(window.confirm('再来一次吧')){
            window.location.reload()
        }
    }
},1000)


// 为每个卡牌添加的点击事件的监听函数
function handlerClick(element){
    // 用于反转卡牌
    resover(element)
    // 用于添加卡牌到对应的数组中(hiddenchosen)
    addCard(element)
    // 设置定时器来完成对两张卡牌是否像同的判定
    setTimeout(()=>{
        equals(cardsChosen)
    },1000)
    clickCount.innerHTML = --click
    if(click==0){
        clearInterval(t)
        if(window.confirm('再来一次吧')){
            window.location.reload()
        }
    }
}

function resover(element){
    let turn = element.getAttribute('data-turn')
    if(turn=='back'){
        element.children[0].style.transform = 'rotateY(-180deg)'
        element.children[1].style.transform = 'rotateY(0deg)'
        element.setAttribute('data-turn','front')
    }else{
        element.children[0].style.transform = 'rotateY(0deg)'
        element.children[1].style.transform = 'rotateY(180deg)'
        element.setAttribute('data-turn','back')
    }
}

function addCard(element){
    let turn = element.getAttribute('data-turn')
    if(turn === 'front'){
        if(cardsChosen.indexOf(element) == -1){
            cardsChosen.push(element)
            // console.log(cardsChosen)
        }
    }
}

function equals(cards){
    // console.log(cards)
    if(cards.length>=2){
        let one = cards[0].getAttribute('data-number')
        let two = cards[1].getAttribute('data-number')
        // console.log(one)
        // console.log(two)
        
        if(one===two){
            cards[0].style.visibility = 'hidden'
            cards[1].style.visibility = 'hidden'
            cardsHidden.push(1,1)
            if(cardsHidden.length==8){
                clearInterval(t)
                if(window.confirm('你赢了')){
                    window.location.reload()
                }
            }
        }else{
            cards[0].setAttribute('data-turn','front')
            cards[1].setAttribute('data-turn','front')
            resover(cards[0])
            resover(cards[1])
        }
        delCards(cards)
    }
}

// 将卡牌从hiddenchosen数组中清空,来为下次点击做准备,达到循环点击的效果
function delCards(cards){
    if(cards.length >= 2){
        cards.splice(0,1)
        cards.splice(0,1)

    }
}

// 这个主要是为了解决原生浏览器对文本选中的干扰
let all = document.querySelectorAll('.card')
all.forEach(element => {
    element.addEventListener('click',function(event){
        event.preventDefault()
    })
});
}else{
    alert('请先设置游戏难度')
}
})

var setbtn = document.getElementById('set')
var levelbtn = document.getElementById('level')
setbtn.addEventListener('click',function(){
levelbtn.style.display = 'flex'
})

var level1 = document.getElementById('levelone')
var level2 = document.getElementById('leveltwo')
var level3 = document.getElementById('levelthree')

// 写入难度参数,一共三个等级
level1.addEventListener('click',function(){
    levelbtn.style.display = 'none'
    numberOfCards = 8
    time = 50
    timeRemaining.innerHTML = time
    click = 20
    clickCount.innerHTML = click
})
level2.addEventListener('click',function(){
    levelbtn.style.display = 'none'
    numberOfCards = 16
    time = 100
    timeRemaining.innerHTML = time
    click =40
    clickCount.innerHTML = click
})
level3.addEventListener('click',function(){
    levelbtn.style.display = 'none'
    numberOfCards = 24
    time = 150
    timeRemaining.innerHTML = time
    click = 80
    clickCount.innerHTML = click
})




