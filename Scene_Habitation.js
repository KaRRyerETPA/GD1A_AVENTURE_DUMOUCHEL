class Scene_Habitation extends Phaser.Scene {
    
    constructor(){
        super("scene_habitation");
    }
    
    
    // Create
    
    create(){


        // Maps

        this.map = this.make.tilemap({ key: 'Habitation' });
        this.tileset = this.map.addTilesetImage('tilesets_objet', 'tilesets_objet');
        this.tileset = this.map.addTilesetImage('tilesets_ground', 'tilesets_ground');

        this.ground = this.map.createStaticLayer('ground', this.tileset, 0, 0);
        this.object = this.map.createDynamicLayer('object', this.tileset, 0, 0);
        this.posed = this.map.createDynamicLayer('posed', this.tileset, 0, 0);


        //  Inputs Keyboard

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        // Player

        this.player = this.physics.add.sprite(3150, 1310, 'player');


        // Aliens

        this.alien = this.physics.add.group();
        this.alien.create(240, 700, 'alien1');
        this.alien.create(220, 950, 'alien2');
        this.alien.create(220, 400, 'alien3');
        this.alien.create(240, 250, 'alien4');
        this.alien.create(180, 250, 'alien5');
        this.alien.create(150, 150, 'alien6');
        this.alien.create(140, 470, 'alien7');
        this.alien.create(148, 700, 'alien8');
        this.alien.create(100, 580, 'alien9');


        // UI

        this.HealthBar = this.add.sprite(100, 50, 'Health').setScrollFactor(0,0);
        this.add.image(1170, 50, 'electronic_chip_number').setScrollFactor(0);


        // Items

        this.electronic_chip = this.physics.add.group();
        this.food = this.physics.add.group();
        this.keycard = this.physics.add.image(840, 180, 'key');
          
         // Door
        
         this.chipNeeded = this.add.text(500, 1000, '10', { fontSize: '40px', fill: '#FFFF00' });
         this.object.setTileLocationCallback(4, 52, 1, 1, ()=>{
             if (chip >= 10){
                 this.object.removeTileAt(4, 52, true, true, 1);
                 this.chipNeeded.destroy();
                 chip -=10;
         }});
        
        // Chip UI
        
        this.add.image('electronic_chip')
        this.scoreText = this.add.text(1210, 30, chip, { fontSize: '50px', fill: '#fff' }).setScrollFactor(0);
        
        
        // Collisions
        
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.environment);
        this.ground.setCollisionByProperty({collides:true});
        this.environment.setCollisionByProperty({collides:true});
        this.physics.add.overlap(this.player, this.electronic_chip, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.food, this.collectFood, null, this);
        this.physics.add.overlap(this.player, this.gun, this.collectGun, null, this);
        this.physics.add.overlap(this.player, this.alien, this.hitAlien, null, this);
        this.physics.add.overlap(this.player, this.keycard, this.finishLevel, null, this);
        
        
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
        
        
        // Cameras
        
        this.camera = this.cameras.main.setSize(1280,720);
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.camera.setBounds(0, 0, 3200, 1600);
        
        
        // Bounds

        this.environment.setTileLocationCallback(99, 38, 1, 5, ()=>{
            if(this.Bounds){
                this.Bounds = false;
                this.scene.start('Scene_Hall')}})
        this.Bounds = true;
        
        
        // VictoryUI
    
        this.victory = this.add.image(820, 360, 'victory').setVisible(false);
    }


    // Update
    
    update(){
        
        
        // Game over
        
        if (gameOver)
        {
            return;
        }
        
        
        // Move animation
        
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
            direction = "left";
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
            direction = "right";
        }
        else if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-160);

            this.player.anims.play('up', true);
            direction = "up";
        }
        else if (this.cursors.down.isDown)
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
        
        
        // HealthBar

        if(invincibility == true)
        {
            timerInvincibility = timerInvincibility + 1
            if(timerInvincibility >= 50)
            {
                invincibility = false
                timerInvincibility = 0
            }
        }
        
        
        // Life check
    
        if(HealthBar == 3)
        {
            this.healthStatus.anims.play('full');
        }

        else if (HealthBar == 2)
        {
            this.healthStatus.anims.play('wounded');
        }

        else if (HealthBar == 1)
        {
            this.healthStatus.anims.play('h_wounded');
        }

        else if (HealthBar <= 0)
        {
            this.physics.pause();
            this.healthStatus.anims.play('dead');
            this.player.destroy();
            gameOver = true;
        }
        
        
        // Chip check
        
        this.scoreText.setText(chip);
        
        
        if (this.alien.getLength() == 0){
            this.environment.removeTileAt(26, 10, true, true, 1);
            this.environment.removeTileAt(27, 10, true, true, 1);
        }
    }
    
    
    // Chip take
    
    collectChip(player, electronic_chip){
        electronic_chip.destroy();
        chip += 1;
    }
    
    
    // Food take
    
    collectFood(player, food){
        food.destroy();
       healthBar += 1;
    }
    
    
    // Gun take
    
    collectGun(player, weapon){
        this.gun.destroy();
        gun = true;
    }
    
    
    // Aliens collision
    
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

    
    
    // EndLevel
    
    finishLevel (player, keycard){
        this.player.disableBody(true, true);
        this.keycard.destroy();
        this.victory.visible = true;
    }
}


