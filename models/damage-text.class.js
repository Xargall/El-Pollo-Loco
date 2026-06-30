class DamageText {
    x;
    y;
    text;
    createdAt;

    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.createdAt = new Date().getTime();
    }

    isExpired() {
        let timepassed = (new Date().getTime() - this.createdAt) / 1000;
        return timepassed > 1;
    }
}