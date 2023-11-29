import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;

@RestController
@SpringBootApplication
public class Example {
    

	@RequestMapping("/")
	String home() {
		return "Hello World!";
	}

	public static void main(String[] args) {
		SpringApplication.run(Example.class, args);
	}

}


// dsa 
public class BestTimeToBuyAndSellStock {
    public int maxProfit(int[] prices) {
        //Kadane's algorithm
        if(prices.length == 0) {
            return 0;
        }
        
        int min = prices[0];
        int max = 0;
        
        for(int i = 1; i < prices.length; i++) {
            if(prices[i] > min) {
                max = Math.max(max, prices[i] - min);
            } else {
                min = prices[i];
            }
        }
        
        return max;
    }
}