class Scene_Hall extends Phaser.Scene {
    
    constructor(){
        super("scene_hall");
    }
    
    
    // Preload
    
    preload(){
        this.load.image('tilesets_objet', 'assets/Assets_objet_V1.png');
        this.load.image('tilesets_ground', 'assets/Assets_zeldalike_V1.png');
        this.load.tilemapTiledJSON('Habitation', 'Scene_Habitation_tiled.json');
        this.load.tilemapTiledJSON('Hall', 'Scene_Hall_tiled.json');
        this.load.spritesheet('player', "assets/Spritesheet_perso.png", { frameWidth: 25, frameHeight: 25 });
        this.load.image('gun', "assets/Gun.png");
        this.load.image('electronic_chip', "assets/Electronic_chip.png");
        this.load.image('electronic_chip_number', "assets/Electronic_chip_number.png");
        this.load.spritesheet('health', "assets/Health.png", { frameWidth: 172, frameHeight: 55});
        this.load.image('food', "assets/food.png");
        this.load.spritesheet('alien', "assets/Spritesheet_alien.png", { frameWidth: 28, frameHeight: 28 });
        this.load.image('keycard', "assets/Keycard.png");
        this.load.image('victory', "assets/victory.png");
    }
    
    
    // Create
    
    create(){
        
        
        // Maps
        
        this.map = this.make.tilemap({ key: 'Hall' });
        this.tileset = this.map.addTilesetImage('Assets_zeldalike_V1', 'tilesets_ground');
        this.tileset = this.map.addTilesetImage('Assets_objet_V1', 'tilesets_objet');

        this.ground = this.map.createStaticLayer('ground', this.tileset, 0, 0);
        this.object = this.map.createDynamicLayer('object', this.tileset, 0, 0);
        this.posed = this.map.createDynamicLayer('posed', this.tileset, 0, 0);
        
        
        // Inputs Keyboard
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        
        // Player
        
        this.player = this.physics.add.sprite(230, 180, 'player');
        
        
        // Aliens
        
        this.alien = this.physics.add.group();
        this.alien.create(500, 2000, 'alien1');
        this.alien.create(800, 900, 'alien2');
        this.alien.create(300, 790, 'alien3');
        this.alien.create(170, 580, 'alien4');
        this.alien.create(150, 350, 'alien5');
        this.alien.create(300, 500, 'alien6');
        this.alien.create(100, 550, 'alien7');
        this.alien.create(220, 700, 'alien8');
        this.alien.create(105, 1250, 'alien9');
        
        
        // Interface
        
        this.healthStatus = this.add.sprite(100, 50, 'health').setScrollFactor(0,0);
        this.add.image(1170, 50, 'electronic_chip_number').setScrollFactor(0);
        
        
        // Items
        
        this.gun = this.physics.add.image(80, 415, 'gun');
        this.electronic_chip = this.physics.add.group();
        this.electronic_chip.create(272, 190, 'electronic_chip');
        this.electronic_chip.create(882, 280, 'electronic_chip');
        this.electronic_chip.create(680, 150, 'electronic_chip');
        this.electronic_chip.create(470, 300, 'electronic_chip');
        this.electronic_chip.create(287, 230, 'electronic_chip');
        this.electronic_chip.create(393, 825, 'electronic_chip');
        this.electronic_chip.create(305, 130, 'electronic_chip');
        this.electronic_chip.create(285, 837, 'electronic_chip');
        this.electronic_chip.create(296, 743, 'electronic_chip');
        this.electronic_chip.create(310, 150, 'electronic_chip');
        this.food = this.physics.add.group();
        this.food.create(278, 230, 'food');
        this.food.create(295, 134, 'food');
        
        // Moving animation
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 17 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 27, end: 35 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
            frameRate: 10,
        });
        
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 18, end: 26 }),
            frameRate: 10,
        });
        
        
        // Attack animation
        
        this.anims.create({
            key: 'downA',
            frames: this.anims.generateFrameNumbers('player', { start: 54, end: 62 }),
            frameRate: 5,
        });
        
        this.anims.create({
            key: 'leftA',
            frames: this.anims.generateFrameNumbers('player', { start: 45, end: 53 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'rightA',
            frames: this.anims.generateFrameNumbers('player', { start: 63, end: 71 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'upA',
            frames: this.anims.generateFrameNumbers('player', { start: 36, end: 44 }),
            frameRate: 5,
        });
        
        
        // electronic_chip number text
        
        this.add.image('electronic_chip')
        this.scoreText = this.add.text(1210, 30, chip, { fontSize: '50px', fill: '#fff' }).setScrollFactor(0);
        
        
        // Collisions
        
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.object);
        this.ground.setCollisionByProperty({collides:true});
        this.object.setCollisionByProperty({collides:true});
        this.physics.add.overlap(this.player, this.electronic_chip, this.collectChip, null, this);
        this.physics.add.overlap(this.player, this.food, this.collectFood, null, this);
        this.physics.add.overlap(this.player, this.gun, this.collectGun, null, this);
        this.physics.add.overlap(this.player, this.alien, this.hitAlien, null, this);
        
        
        // Tweens
        
        var move = this;

        this.alien.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: child.x-50,
                ease: 'Linear',
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        })
        
        
        // Life Status

        this.anims.create({
            key: 'full',
            frames: [ { key: 'health', frame: 0. } ],
        });

        this.anims.create({
            key: 'wounded',
            frames: [ { key: 'health', frame: 1. } ],
        });

        this.anims.create({
            key: 'h_wounded',
            frames: [ { key: 'health', frame: 2. } ],
        });

        this.anims.create({
            key: 'dead',
            frames: [ { key: 'health', frame: 3. } ],
        });
        
        
        // Cameras
        
        this.camera = this.cameras.main.setSize(1280,720);
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.camera.setBounds(0, 0, 3200, 1600);
        
        
        // Bounds
        
        this.object.setTileLocationCallback(0, 38, 1, 5, ()=>{
            if(this.bounds){
                this.bounds = false;
                this.scene.start('Scene_Habitation')}})
        this.bounds = true;
        }
    
       
    // Update
    
    update(){
        
        
        // Inputs controller
    
        let pad = Phaser.Input.Gamepad.Gamepad;

        if(this.input.gamepad.total){
            pad = this.input.gamepad.getPad(0)
            xAxis = pad ? pad.axes[0].getValue() : 0;
            yAxis = pad ? pad.axes[1].getValue() : 0;
    }
        
        
        // Game over
        
        if (gameOver)
        {
            return;
        }
        
        
        // Moving animation
        
        if (this.cursors.left.isDown || pad.left == 1 || xAxis < 0)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
            direction = "left";
        }
        else if (this.cursors.right.isDown || pad.right == 1 || xAxis > 0)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
            direction = "right";
        }
        else if (this.cursors.up.isDown || pad.up == 1 || xAxis > 0)
        {
            this.player.setVelocityY(-160);

            this.player.anims.play('up', true);
            direction = "up";
        }
        else if (this.cursors.down.isDown || pad.down == 1 || xAxis > 0)
        {
            this.player.setVelocityY(160);

            this.player.anims.play('down', true);
            direction = "down";
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }  
        
        
        if (this.keySpace.isDown && direction == "down" && gun == true)
        {
            this.player.anims.play('downA', true);
        }
        
        if (this.keySpace.isDown && direction == "left" && gun == true)
        {
            this.player.anims.play('leftA', true);
        }
        
        if (this.keySpace.isDown && direction == "right" && gun == true)
        {
            this.player.anims.play('rightA', true);
        }

        if (this.keySpace.isDown && direction == "up" && gun == true)
        {
            this.player.anims.play('upA', true);
        }
        
        
        // HealthBar

        if(invincibility == true)
        {
            timerInvincibility = timerInvincibility + 1
            if(timerInvincibility >= 50)
            {
                Invincibility = false
                timerInvincibility = 0
            }
        }
        
        
        // Life check
    
        if(healthBar == 3)
        {
            this.healthStatus.anims.play('full');
        }

        else if (healthBar == 2)
        {
            this.healthStatus.anims.play('wounded');
        }

        else if (healthBar == 1)
        {
            this.healthStatus.anims.play('h_wounded');
        }

        else if (healthBar <= 0)
        {
            this.physics.pause();
            this.healthStatus.anims.play('dead');
            this.player.destroy();
            gameOver = true;
        }
        
        
        // Chip count
        
        this.scoreText.setText(chip);
    }
    
    
    // chip take
    
    collectChip(player, electronic_chip){
        electronic_chip.destroy();
        chip += 1;
    }
    
    
    // food take
    
    collectFood(player, food){
        food.destroy();
       healthBar += 1;
    }
    
    
    // gun take
    
    collectGun(player, weapon){
        this.gun.destroy();
        gun = true;
    }
    
    
    // alien collision
    
    hitAlien (player, alien){
        if (this.keySpace.isDown && gun)
        {
            this.electronic_chip.create(alien.x, alien.y, 'electronic_chip');
            alien.destroy();
        }
        else if (healthBar > 0 && invincibility == false)
        {
            healthBar = healthBar - 1;
            invincibility = true;
        }
    } 
}