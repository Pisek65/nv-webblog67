module.exports = (sequelize, DataTypes) => {
    const Figure = sequelize.define('Blog', {
        namecharacter: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        pictures: DataTypes.TEXT,
        content: DataTypes.TEXT,
        namefigure: DataTypes.STRING,
        status: DataTypes.STRING,
    })
    return Figure
}