var isSoundMuted = false;
var soundMuteX_Icon_Icon;
var gameSoundEffectVolume = 1.0;

function GetBulletTimeHeartbeatSound()
{
    return bulletTimeHeartbeatSound = game.add.audio('audio-bullet-time-heartbeat', gameSoundEffectVolume, false);
}

function GetBulletTimeStartSound()
{
    return bulletTimeStartSound = game.add.audio('audio-bullet-time-start', gameSoundEffectVolume / 4.0, false);
}

function GetBulletTimeStopSound()
{
    return game.add.audio('audio-bullet-time-stop', gameSoundEffectVolume / 4.0, false);
}

function GetExplosionSound()
{
    return game.add.audio('audio-player-explodes', gameSoundEffectVolume / 4.0, false)
}

function GetGameOverSound()
{
    return game.add.audio('audio-game-over', gameSoundEffectVolume / 2.0, false)
}

function GetLevelCompleteSound()
{
    return game.add.audio('audio-level-complete', gameSoundEffectVolume, false)
}

function GetLevelCompleteSound()
{
    return game.add.audio('audio-level-complete', gameSoundEffectVolume, false)
}

function GetPowerUpLightningStrikeSound()
{
    return game.add.audio('audio-powerup-lightningstrike', gameSoundEffectVolume, false)
}

function MuteSound()
{
    // Toggle mute
    isSoundMuted = !isSoundMuted;
    //console.log("Muted: " + isSoundMuted);

    // Mute all sounds
    if (isSoundMuted)
    {
        //TODO: stop all sounds in progress.
        game.sound.mute = true;

        showMuteXIcon(true);
    }
    // Enable all sounds
    else
    {
        game.sound.mute = false;

        showMuteXIcon(false);
    }
}