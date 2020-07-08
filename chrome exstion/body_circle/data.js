var datas = [
	{
	todo : "子时上床睡觉去",
	time : "子时 23:00－1:00",
	acod : "胆经",
	body : "胆汁需要新陈代谢，人在子时入眠，胆方能完成代谢，但这个时候心脏功能最弱，心脏病患者绝大多数在夜间（心脏功能差）发病和死亡",
	rule : "临床证明，心脏病患者大多数在页面发病和死亡，家里如果有心脏病人，要加强观察，备好救心丸，这时要上床睡觉，有利于骨髓造血，凡在子时能入睡者，晨醒后头脑清新，气色红润。"
	},
	{
	todo : "丑时熟睡保肝",
	time : "丑时 1:00－3:00",
	acod : "肝经",
	body : "此时是肝脏修复的最佳时段。人的思维和行动要靠肝血的支持，废旧的血液需要淘汰，新鲜血液需要产生，这种代谢通常在肝经最旺的丑时完成。",
	rule : "必须进入熟睡状态，让肝脏得到最充足能量。如果丑时不入睡，肝还在输出能量支持人的思维和行动，就无法完成新陈代谢。虚火旺盛的人，在这个时候睡着，还能够降虚火。"
	},
	{
	todo : "寅时梦里深呼吸",
	time : "寅时 3：00－5：00",
	acod : "肺经",
	body : "大地阴阳从此刻转化，由阴转阳。人体此时也进入阳盛阴衰之时。此刻肺经最旺。而肺不好的人会经常咳嗽，就算是睡着后也会咳嗽，有些人可能在睡着后，咳得更厉害。",
	rule : "此刻人体需要大量呼吸氧气，进行深呼吸，所以要求较深的睡眠。在这个时候，如果您咳醒的话，最好是喝杯温开水，能够缓解一下，还可以去肺燥。"
	},
	{
	todo : "卯时记得上厕所",
	time : "卯时 5：00－7：00",
	acod : "大肠经",
	body : "这是大肠经活跃的最佳时段。肺将充足的新鲜血液布满全身，紧接着促进大肠经进入兴奋状态，完成吸收食物中水分与营养，排出渣滓的过程。",
	rule : "赶紧起床，起床后喝杯温开水，然后奔进厕所把一天积攒下来的废物，都排出体外吧！不过上厕所不要太赶，很多老年人中风是因为这样引起的。我们不如休息10－20分钟清醒清醒头脑再去。"
	},
	{
	todo : "辰时勿忘吃早餐",
	time : "辰时 7：00－9：00",
	acod : "胃经",
	body : "你的胃已经等了整整一个晚上，早就饿得不行，此刻它睡醒了过来，所以，这个时候吃早饭它会尽全力消化。如果胃火过盛，嘴唇干，重则唇裂或生疮。",
	rule : "此时要吃早餐。如果你不给它东西填饱，它就一直分泌胃酸。饿久了，就会有胃溃疡、胃炎、十二指肠炎、胆囊炎等危险！饭后一小时后按揉胃经可调节胃肠功能。"
	},
	{
	todo : "巳时喝水六杯",
	time : "巳时 9：00－11：00",
	acod : "脾经",
	body : "此时脾经最旺。脾是消化、吸收、排泄的总调度，又是人体血液的统领。脾的功能好，消化吸收好，血的质量就好，所以嘴唇是红润的。否则唇白或唇暗、唇紫。",
	rule : "这个时辰要喝至少6杯水，慢慢饮，让脾脏处于最活跃的程度。我们不能等口渴了再喝，要平时就均匀地喝水。因为感到口渴那代表你的身体已经缺水，这时候补充就略显迟了些。"
	},
	{
	todo : "午时小憩助精力",
	time : "午时 11：00－13：00",
	acod : "心经",
	body : "心经最旺。也是人一天中精力最充沛的时候。心推动血液运行，养神、养气、养筋。人在午时能睡片刻，对于养心大有好处，可使下午乃至晚上精力充沛。",
	rule : "此时保持心情舒畅，适当休息或午睡。但午睡不能超过一个小时，否则会夺觉，容易引起晚上失眠。午睡起床后要适量运动，以利疏通周身气血，增强脏腑的功能活动。"
	},
	{
	todo : "未时吸收营养物",
	time : "未时 13：00－15：00",
	acod : "小肠经",
	body : "小肠经最旺。小肠分清浊，把水液归于膀胱，糟粕送入大肠，精华输送进脾。小肠经在未时对人一天的营养进行调整。如小肠有热，人会咳而排气。",
	rule : "故午餐应该在下午1：00之前吃完，才能在小肠精力最旺盛的时候把营养物质都吸收进人体。否则，好东西都没被吸收完全，真是物质的巨大浪费。9申时有尿别憋着时辰时间对应经络 申时15：00－17：00膀胱经人体状况：膀胱经最旺。膀胱贮藏水液和津液，水液排出外，津液循环在体内。若膀胱有热可致膀胱咳，即咳而遗尿。申时人体体温较热，阴虚的人尤为突出。膀胱最活跃的时候，适合多喝水。要想尿尿，这个时候一定不要总是憋着，否则久了，就会有“尿潴留”等情况发生。即是说膀胱括约肌出现没有弹性的状况。"
	},
	{
	todo : "酉时宜夫妻生活",
	time : "酉时 17：00－19：00",
	acod : "肾经",
	body : "“肾藏生殖之精和五脏六腑之精。肾为先天之根。”经过申时的人泻火排毒，肾在酉时进入贮藏精华的时辰。这是一个男人的时刻。",
	rule : "对于肾功能有问题的人而言，在这个时候按摩肾经的穴位，效果最为明显。"},
	{
	todo : "戌时散步保心包",
	time : "戌时 19：00－21：00",
	acod : "心包经",
	body : "心包经主要起到保护心脏、保存精力的作用。心包是心的保护组织，又是气血通道。心包戌时兴旺可清除心脏周围外邪，使心脏处于完好状态。",
	rule : "心脏不好的人最好在这个时候敲心包经，效果最好。此刻应该给自己创造安然入眠的好条件。最好不要剧烈运动，否则容易失眠。所做的运动最好是散步。其实晚饭后的散步不仅起到帮助消化的作用，还有利心脏哦。"
	},
	{
	todo : "亥时怄气没好处",
	time : "亥时 21：00－23：00",
	acod : "三焦经",
	body : "三焦是六腑中最大的腑，有主持诸气、疏通水道的作用。亥时三焦通百脉。人如果在亥时睡眠，百脉可休养生息，对身体十分有益。",
	rule : "此刻要保持心境平静。不生气，不狂喜，不大悲。如果你跟老婆夜里吵架，而且赌气很严重，夜里11点气都还没消，那你第二天一定精神萎靡不振"
	}
];