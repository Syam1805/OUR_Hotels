package com.hotelbooking.service;

import com.hotelbooking.dto.AuthResponse;
import com.hotelbooking.dto.LoginDTO;
import com.hotelbooking.dto.UserDTO;
import com.hotelbooking.entity.User;
import com.hotelbooking.entity.Booking;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Register new user
    public User register(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setPhone(userDTO.getPhone());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");
        return userRepository.save(user);
    }

    // Login
    public AuthResponse login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getRole(), user.getUserId());
    }

    // Fetch all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update user
    public User updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        user.setPhone(userDTO.getPhone());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : user.getRole());
        return userRepository.save(user);
    }

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Fetch user profile
    public User getUserProfile(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // ✅ Fetch order history for user
    public List<Booking> getUserOrderHistory(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return bookingRepository.findByUser_UserId(userId);
    }

    // For Spring Security
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }
}
