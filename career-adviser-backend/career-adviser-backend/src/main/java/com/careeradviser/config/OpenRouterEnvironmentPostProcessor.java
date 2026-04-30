package com.careeradviser.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.util.StringUtils;

import java.util.Map;

public class OpenRouterEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String SPRING_AI_OPENAI_API_KEY = "spring.ai.openai.api-key";
    private static final String OPENROUTER_API_KEY = "OPENROUTER_API_KEY";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if (StringUtils.hasText(environment.getProperty(SPRING_AI_OPENAI_API_KEY))) {
            return;
        }

        String openRouterApiKey = environment.getProperty(OPENROUTER_API_KEY);
        if (StringUtils.hasText(openRouterApiKey)) {
            environment.getPropertySources().addFirst(new MapPropertySource(
                    "openRouterApiKey",
                    Map.of(SPRING_AI_OPENAI_API_KEY, openRouterApiKey)
            ));
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }
}
