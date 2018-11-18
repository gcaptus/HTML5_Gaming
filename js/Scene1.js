var platforms;
var player;
var cursors;
var beers;
var waters;
var score=0;
var gameOver = false;
var scoreText;
var scene;


class Scene1 extends Phaser.Scene {
    
    constructor (){
        super({key: "Scene1"})
    }

    preload ()
    {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('ground', 'assets/platformweed.png');
        this.load.image('beer', 'assets/cerveza1.png');
        this.load.image('water', 'assets/waterbottle.png');
        this.load.image('cactus', 'assets/CactusSpritelit.png');
        this.load.spritesheet('bar', 'assets/bartender.png', { frameWidth: 40, frameHeight: 78 });
    }

    create ()
    {
        //le bg
        this.add.image(400, 300, 'bg');

        //ajout du cactus
        this.add.image(500, 500, 'cactus');        

        //le groupe avec les platformes
        platforms = this.physics.add.staticGroup();

        //le sol
        //multiplié pour faire toute la largeur
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //le positionnement des plateformes
        platforms.create(600, 400, 'ground');
        platforms.create(50, 320, 'ground');
        platforms.create(750, 240, 'ground');
        platforms.create(-30, 160, 'ground');

        //le joueur et ses réglages
        player = this.physics.add.sprite(100, 450, 'bar');

        //propriété physiques du joueur
        //il rebondit
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        //les animation du perso, de face, quand il va à gauche et à droite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('bar', { start: 8, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'bar', frame: 1 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('bar', { start: 12, end: 14 }),
            frameRate: 10,
            repeat: -1
        });

        //event
        cursors = this.input.keyboard.createCursorKeys();

        //les bières qu'il faut collecter
        beers = this.physics.add.group({
            key: 'beer',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70}
        });


        //chaque bière rebondit différement
        beers.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        waters = this.physics.add.group();

        //  The score
        scoreText = this.add.text(16, 16, '0 cl de Bière', { fontSize: '32px', fill: '#d87800' });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(beers, platforms);
        this.physics.add.collider(waters, platforms);
        this.physics.add.collider(player, waters, hitWater, null, this);

        this.physics.add.overlap(player, beers, collectBeer, null, this);
    }

    update (){

        if (gameOver)
            {
                return;
            }

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-320);
        }

        /*if (score>=1200) 
        {
            scene.start:Scene2;
            return;
        }*/
    }
}    

    function collectBeer (player, beer)
    {
        beer.disableBody(true, true);

        score += 25;
        scoreText.setText(score + 'cl de Bière');

        if (beers.countActive(true) === 0)
        {
            beers.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var water = waters.create(x, 8, 'water');
            water.setBounce(1);
            water.setCollideWorldBounds(true);
            water.setVelocity(Phaser.Math.Between(-200, 200), 20);
            water.allowGravity = false;
        }

    }

    function hitWater (player, water){
        if(score==0){
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }else{
            score=0;
        }        
    }


