"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class mobil extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    mobil.init(
        {
            nama: DataTypes.STRING,
            harga: DataTypes.INTEGER,
            ukuran: DataTypes.STRING,
            gambar: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "mobil",
        }
    );
    return mobil;
};
