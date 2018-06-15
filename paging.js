var Paging = (function($, fn){
	return $ ? fn($) : null;
})(window.jQuery, function($){
	var paging = function(opts){
		opts.box.addClass('jiuy-paging');
		this.box = opts.box;												//容器
		this.maxPg = opts.maxPg && opts.maxPg > 7 ? opts.maxPg : 7;			//显示多少个页号, 请传入大于等于7的奇数
		this.num = opts.num || 1;											//当前页号
		this.callback = opts.callback || function(n){};
	}

	//启用
	paging.prototype.run = function(np) {
		this.box.empty();
		this.np = np;										//总页数
		this.minCPn = Math.ceil(this.maxPg/2);				//最小的中心轴数
		this.maxCPn = np - this.minCPn+1;						//最大的中心轴数
		this.createHtml(np);
		this.calcShowPageNum(this.num);

		return this;
	};

	//生成html
	paging.prototype.createHtml = function(np) {
		this.btnPrev = $('<span class="btn p-n prev">上一页</span>');
		this.btnNext = $('<span class="btn p-n next">下一页</span>');
		this.npBox	 = $('<ul class="page-box"></ul>');
		this.btnGoPage = $('<span class="btn g-n">翻页</span>');
		this.inputGoPage = $('<input type="number" name="pnum" min="1" max="'+this.np+'" />');

		var $goPageBox = $('<div class="gopage-box"></div>');

		$goPageBox.append(this.inputGoPage).append(this.btnGoPage);

		this.ceatePageHtml(1, true);

		this.box.append(this.btnPrev);
		this.box.append(this.npBox);
		this.box.append(this.btnNext);
		this.box.append($goPageBox);

		return this;
	};

	//生成页码号
	paging.prototype.ceatePageHtml = function(i, isInit) {
		var np = this.np,
			n = this.maxPg > np ? np : this.maxPg,
			le = isInit ? n : n-1;
			_i = i,
			t = i;

		isInit && this.npBox.empty();

		for (var j = 1; j <= le; i++, j++) {
			var x = '',
				dx = '',
				css = 'btn';

			if(!isInit && _i == i && i > 2){
				x = '...';
				css += ' more min';
			}else if(j == le-1 && t < np-1 && _i != this.maxCPn){
				t++;
				x = '...';
				css += ' more max';
			}else if(j == le && t <= np){
				t++;
				x = np;
				css += ' to';
			}else{
				x = t++;
				css += ' to';
			}

			if(x == this.num) css += ' active';

			dx = x != '...' ? x : 'more';

			if(isInit) {
				this.npBox.append('<li class="'+css+'" data-x="'+dx+'">'+x+'</li>');
			}else{
				var rEle = this.npBox.children().eq(j);
				rEle.attr('data-x',dx).text(x);
				rEle[0].className = css;
			}
		}

		isInit && this.bindEvent();

		return this;
	};

	//事件绑定
	paging.prototype.bindEvent = function() {
		var self = this;

		self.npBox.on('click', 'li', function(e){
			var $ths = $(this),
				t = $ths.text();

			if($ths.hasClass('to') && t != self.num){
				self.calcShowPageNum(t-0);
			}
		});

		self.box.on('click', '.p-n', function(e){
			var $ths = $(this);

			if($ths.hasClass('prev')){
				self.num > 1 && self.calcShowPageNum(self.num - 1);
			}else{
				self.num < self.np && self.calcShowPageNum(self.num + 1);
			}
		});

		self.btnGoPage.on('click', function(e){
			var n = self.inputGoPage.val();

			if(!isNaN(n) && n <= self.np){
				self.calcShowPageNum(n-0);
			}
		});

		self.inputGoPage.on('input', function(e){
			var $ths = $(this),
				n 	 = $ths.val();

			if(n && (isNaN(n) || n > self.np || n < 1)){
				$ths.val(($ths.data('yv') || 1));
				return this;
			}

			$ths.data('yv', n);
		});
	};

	//计算显示页码 n => 当前点击页号
	paging.prototype.calcShowPageNum = function(n) {
		this.num = n;

		n == 1 ? this.btnPrev.addClass('disabled') : this.btnPrev.removeClass('disabled');
		n == this.np ? this.btnNext.addClass('disabled') : this.btnNext.removeClass('disabled');

		this.npBox.find('.active').removeClass('active');

		if(this.np > this.maxPg) {
			var btn_lis = this.npBox.children();

			if(n <= this.minCPn && btn_lis.eq(1).hasClass('more')){
				this.ceatePageHtml(2);
			}else if(n >= this.maxCPn && btn_lis.eq(btn_lis.length-2).hasClass('more')){
				this.ceatePageHtml(this.maxCPn - this.minCPn + 3);
			}else if(n > this.minCPn && n < this.maxCPn){
				var t = n - this.minCPn + 3;

				this.ceatePageHtml(t);
			}
		}

		this.npBox.find('[data-x="'+n+'"]').addClass('active');

		this.callback(n);
	};

	return paging;
})