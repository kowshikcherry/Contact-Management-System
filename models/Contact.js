import { DataTypes } from 'sequelize';
import sequelize from '../lib/db';
import User from './User';

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Contact.belongsTo(User, { foreignKey: 'userId' });

export default Contact;
