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


// question 2 

class FindAllNumbersDisappearedInAnArray {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> result = new ArrayList<Integer>();
        HashMap<Integer, Integer> map = new HashMap<Integer, Integer>();
        for(int i = 1; i <= nums.length; i++) {
            map.put(i, 1);
        }
        
        for(int i = 0; i < nums.length; i++) {
            if(map.containsKey(nums[i])) {
                map.put(nums[i], -1);
            }
        }
        
        for(int i: map.keySet()) {
            if(map.get(i) != -1) {
                result.add(i);
            }
        }

        
        

        public class InsertInterval {
    public List<Interval> insert(List<Interval> intervals, Interval newInterval) {
        int i = 0;

        while(i < intervals.size() && intervals.get(i).end < newInterval.start) {
            i++;
        }

        while(i < intervals.size() && intervals.get(i).start <= newInterval.end) {
            newInterval = new Interval(Math.min(intervals.get(i).start, newInterval.start), Math.max(intervals.get(i).end, newInterval.end));
            intervals.remove(i);
        }
        
        intervals.add(i, newInterval);

        return intervals;
    }
}