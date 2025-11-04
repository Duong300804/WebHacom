package com.example.computer_store.config;

import com.example.computer_store.common.URLConstant;
import com.example.computer_store.service.Auth.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] WHITE_LIST = { URLConstant.AUTH_API.LOGIN, URLConstant.AUTH_API.REGISTER, URLConstant.AUTH_API.FORGOT_PASSWORD,
                                                URLConstant.CATEGORY_API.GET_ALL_CATEGORY, URLConstant.CATEGORY_API.GET_CATEGORY_BY_ID, URLConstant.CATEGORY_API.SEARCH_CATEGORY, URLConstant.CATEGORY_API.FILTER_CATEGORY,
                                                URLConstant.BRAND_API.GET_ALL_BRAND, URLConstant.BRAND_API.GET_BRAND_BY_ID, URLConstant.BRAND_API.SEARCH_BRAND, URLConstant.BRAND_API.FILTER_BRAND,
                                                URLConstant.TAG_API.GET_ALL_TAG, URLConstant.TAG_API.GET_TAG_BY_ID, URLConstant.TAG_API.SEARCH_TAG, URLConstant.TAG_API.FILTER_TAG,
                                                URLConstant.PRODUCT_API.GET_ALL_PRODUCT, URLConstant.PRODUCT_API.GET_PRODUCT_BY_ID, URLConstant.PRODUCT_API.SEARCH_PRODUCT, URLConstant.PRODUCT_API.FILTER_PRODUCT, URLConstant.PRODUCT_API.COUNT_PRODUCT_BY_FILTER,
                                                URLConstant.PRODUCT_API.GET_BY_CATEGORY, URLConstant.PRODUCT_API.SORT_PRODUCT_BY_NEWEST, URLConstant.PRODUCT_API.SORT_PRODUCT_BY_PRICE_ASC, URLConstant.PRODUCT_API.SORT_PRODUCT_BY_PRICE_DESC,
                                                URLConstant.NOTIFICATION_API.GET_ALL_NOTIFICATIONS, URLConstant.NOTIFICATION_API.GET_NOTIFICATION_BY_ID,URLConstant.NOTIFICATION_API.GET_UNREAD_NOTIFICATIONS,
                                                URLConstant.IMAGES_API, URLConstant.UPLOAD_IMAGE,
                                                URLConstant.BANNER_API.GET_ALL_BANNER, URLConstant.BANNER_API.GET_BANNER_BY_ID, URLConstant.BANNER_API.SEARCH_BANNER, URLConstant.BANNER_API.FILTER_BANNER,
                                                URLConstant.NEWS_API.GET_ALL_NEWS, URLConstant.NEWS_API.GET_NEWS_BY_ID, URLConstant.NEWS_API.SEARCH_NEWS, URLConstant.NEWS_API.FILTER_NEWS,
                                                URLConstant.ORDER_API.TRACK_ORDER};

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CustomAuthenticationEntryPoint authenticationEntryPoint;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Autowired
    private CustomUserDetailsService userDetailsService;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(WHITE_LIST).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Dùng NoOp để login với mật khẩu plain text (12345678)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    //Dùng để mã hóa password
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
}