package com.demo.register.dao.mybatis;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;

import com.demo.register.bean.User;
import com.demo.register.dao.IUserDao;

public interface MyBatisUserDao extends IUserDao {
	
	@Select("SELECT * FROM rd_user WHERE id = #{id}")
	public User getUserById(@Param("id") int id);
	
	@Select("SELECT * FROM rd_user WHERE username = #{username}")
	public User getUserByUsername(@Param("username") String username);
	
	@Select("SELECT * FROM rd_user order by id")
	public List<User> getUserList();
	
	@Insert("INSERT INTO rd_user(username, password, phone, email) " +
			"VALUES(#{username}, #{password}, #{phone}, #{email})")
	@SelectKey(statement="SELECT @@IDENTITY", keyProperty="id", before=false, resultType=int.class)
	public void insert(User user);
	
	@Update("UPDATE rd_user " +
			"SET username=#{username}, password=#{password}, phone=#{phone}, email=#{email} " +
			"WHERE id=#{id}")
	public void update(User user);
	
	@Delete("DELETE FROM rd_user WHERE id = #{id}")
	public void deleteUserById(@Param("id") int id);
}
