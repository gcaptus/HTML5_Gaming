
var player;
var cursors;
var beers;

var gameOver = false;
var scoreText;
var groundLayer, beerLayer;


class Scene2 extends Phaser.Scene {
	constructor ()
	{
        super({key: "Scene2"})
    }

    preload ()
    {
        this.load.image('back', 'assets/background-wallpapers-9.jpg');
        //this.load.image('water', 'assets/waterbottle.png');
        this.load.image('biere', 'assets/cerveza1.png');
        //this.load.image('cactus', 'assets/CactusSpritelit.png');
        this.load.spritesheet('pj', 'assets/bartender.png', { frameWidth: 40, frameHeight: 78 });
        this.load.tilemapTiledJSON('map', 'assets/map1.json');
        this.load.spritesheet('tiles', 'assets/tilesheet_complete.png', {frameWidth:64, frameHeight:64});
    }

    create () 
    {

    	//le bg
        this.add.image(400, 300, 'back');
    	//chargement de la map
    	map = this.make.tilmap({key:'map'});
    	//les tiles pour la map
    	var groundTiles = map.addTilesetImage('tiles');
    	//création du sol et des platformes
    	groundLayer = map.createDynamicLayer('groundL2', groundTiles, 0, 0);
    	//mise en place des collision
    	groundLayer.setCollisionByExclusion([-1]);

    	//image es bières
    	var beerTiles = map.addTilesetImage('biere');
    	//ajout des bière en tiles
    	beerLayer = map.createDynamicLayer('beerL2', beerTiles, 0, 0);
    	//on déclare les limites du monde
    	this.physics.world.bounds.width=groundLayer.width;
    	this.physics.world.bounds.height=groundLayer.height;

    	

    	//le joueur et ses réglages
        player = this.physics.add.sprite(100, 450, 'pj');

        //propriété physiques du joueur
        //il rebondit
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        //les animation du perso, de face, quand il va à gauche et à droite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pj', { start: 8, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'pj', frame: 1 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pj', { start: 12, end: 14 }),
            frameRate: 10,
            repeat: -1
        });

        //event
        cursors = this.input.keyboard.createCursorKeys();

        //fixe limites e la caméra
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        //fixe la caméra sur le joueur
        this.cameras.main.startFollow(player);


        this.physics.add.collider(player, groundLayer);
        this.physics.add.collider(beers, platforms);
        //this.physics.add.collider(waters, platforms);
        //this.physics.add.collider(player, waters, hitWater, null, this);
        this.physics.add.overlap(player, beers, collectBeer, null, this);


    }

    update () 
    {
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