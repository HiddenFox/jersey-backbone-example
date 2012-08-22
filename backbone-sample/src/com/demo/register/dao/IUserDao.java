package com.demo.register.dao;

import java.util.List;

import com.demo.register.bean.User;

public interface IUserDao {
	public User getUserById(int id);
	public User getUserByUsername(String username);
	public List<User> getUserList();
	public void insert(User user);
	public void update(User user);
	public void deleteUserById(int id);
}
