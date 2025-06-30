import {User} from "../models/user.js";
import { Task } from '../models/task.js';
import { Op } from 'sequelize';


import {Status} from "../constants/index.js";


async function getUsers(req, res, next) {
  try {
    const users = await User.findAll({
        attributes: ['id', 'username', 'password','status'],
        order: [['id', 'DESC']],
        where: {
          status: Status.ACTIVE,
        },  
    });
    res.json(users);
  } catch (error) {
    next(error);

    
  }
}
async function createUser(req, res, next) {
  console.log('Entro al controlador');
  console.log(req.body);
  const {username, password} = req.body;
  try {
  //  const passwordHash = await User.encriptar(password);
    const user = await User.create({
      username, 
      password,
    })
    res.json(user)
  } catch (error) {
   next(error);


  }
}

async function getUser(req, res, next) {
  const { id } = req.params;
  try {
   
    const user = await User.findOne({
      attributes: ['username', 'password','status'], 
      where: {
        id
      },
    });
    if (!user) res.status(404).json({ message: 'User not foun' });
    res.json(user);
  } catch (error) {
    next(error);
    }
}

async function updateUser(req, res, next) {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    user.password = password; // el hook beforeUpdate se encargará de encriptar

    await user.save(); // esto sí ejecuta el hook

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.params;

  try {
    const deleted = await User.destroy({
      where: { id }
    });

    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
    }

   return res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}


async function activateInactivate(req, res, next) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if(!status) res.status(400).json({ message: 'Status is required' });
    const user = await User.findByPk(id);
    if (!user) res.status(404).json({ message: 'User not found' });

    if (user.status === status) {
      res.status(409).json({ message: `Some Status` });
    } 
    user.status = status;
    await user.save(); // esto ejecuta el hook beforeUpdate 
    res.json(user);
    
  } catch (error) {
    next(error);
  }
}



async function getTasks(req, res, next) {
  const { id } = req.params; 
    try {
    const user = await User.findOne({
      attributes: [ 'username'],
      include: [
        {
          model: Task,
          attributes: ['name', 'done'],
          where: {
            done: true, 
        }
      }
    ],
    where: {
       id
      }
    })
       res.json(user);    
  } catch (error) {
    next(error);
  }
}


async function getUsersPaginated(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const allowedLimits = [5, 10, 15, 20];

    if (!allowedLimits.includes(limit)) {
      return res.status(400).json({
        message: `El valor de 'limit' debe ser uno de: ${allowedLimits.join(', ')}`,
      });
    }


    const search = req.query.search || '';
    const orderBy = req.query.orderBy || 'id';
    const orderDir = (req.query.orderDir || 'DESC').toUpperCase();

    const offset = (page - 1) * limit;

    const where = search
      ? { username: { [Op.iLike]: `%${search}%` } }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderBy, orderDir]],
      attributes: ['id', 'username', 'status'],
    });

    const pages = Math.ceil(count / limit);

    res.json({
      total: count,
      page,
      pages,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
}


export default {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  activateInactivate,
  getTasks,
  getUsersPaginated

};