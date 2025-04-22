package com.version0.lexora.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User.UserBuilder; // Correct import for UserDetails builder
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.version0.lexora.model.User;
import com.version0.lexora.repository.UserRepository;

import java.util.Optional;

@Service("userDetailsService") // Explicitly name the bean
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByEmail(email);

        User user = userOptional.orElseThrow(() ->
                new UsernameNotFoundException("User not found with email: " + email));

        // Build the Spring Security UserDetails object
        UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(email);
        builder.password(user.getPassword());
        // Assign roles/authorities. For simplicity, assign 'USER' role to everyone.
        // In a real app, you might store roles in the User entity.
        builder.roles("USER");
        // You can add more authorities using .authorities("...)

        return builder.build();
    }
}
