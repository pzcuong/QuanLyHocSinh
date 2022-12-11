<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="IE104N13CNCL__Nhm_01_0"></a>IE104.N13.CNCL - Nhóm 01</h1>
<h4 class="code-line" data-line-start=1 data-line-end=2 ><a id="Phn_mm_Qun_l_hc_sinh_1"></a>*Phần mềm: Quản lý học sinh</h4>
<p class="has-line-data" data-line-start="2" data-line-end="3"><a href="https://travis-ci.org/joemccann/dillinger"><img src="https://travis-ci.org/joemccann/dillinger.svg?branch=master" alt="Build Status"></a></p>
<h2 class="code-line" data-line-start=4 data-line-end=5 ><a id="Gii_thiu_4"></a>Giới thiệu</h2>
<p class="has-line-data" data-line-start="5" data-line-end="7">Việc quản lý học sinh trên sổ sách cũng tốn rất nhiều công sức cho nhân viên nhà trường. Đối với các trường có số lượng học sinh ít, không đủ điều kiện về kinh tế thì có thể quản lý trên sổ sách, còn đối với các trường ở thành phố, có đủ điều kiện kinh tế và có số lượng học sinh lớn thì việc quản lý cổ điển như vậy sẽ tốn rất nhiều thời gian, công sức. Một học sinh thì có rất nhiều thông tin cá nhân, các cột điểm của các môn học khác nhau, các vấn đề phát sinh liên quan… Các thông tin này rất phức tạp, cùng với số lượng lớn thông tin thì việc quản lý này trở nên bất khả thi. Ngoài ra, việc quản lý học sinh cũng trở nên phức tạp hơn, không chỉ quản lý từng học sinh mà còn đòi hỏi kiểm kê số liệu, thống kê điểm số của từng học sinh, từng môn, từng lớp.<br>
Vì thế việc thay đổi giữa quản lý trực tiếp và quản lý trực tuyến là hoàn toàn cần thiết.</p>
<h2 class="code-line" data-line-start=8 data-line-end=9 ><a id="Tnh_nng_8"></a>Tính năng</h2>
<ul>
<li class="has-line-data" data-line-start="9" data-line-end="10">Tiếp nhận học sinh (Admin)</li>
<li class="has-line-data" data-line-start="10" data-line-end="11">Tiếp nhận giáo viên (Admin)</li>
<li class="has-line-data" data-line-start="11" data-line-end="12">Xếp lớp (Admin)</li>
<li class="has-line-data" data-line-start="12" data-line-end="13">Tra cứu thông tin học sinh (Giáo viên, Admin)</li>
<li class="has-line-data" data-line-start="13" data-line-end="14">Tra cứu lớp học (Giáo viên, Admin)</li>
<li class="has-line-data" data-line-start="14" data-line-end="15">Thay đổi thông tin cá nhân (Giáo viên, Admin, Học sinh)</li>
<li class="has-line-data" data-line-start="15" data-line-end="16">Thêm bảng điểm môn học (Giáo viên, Học sinh)</li>
<li class="has-line-data" data-line-start="16" data-line-end="17">Xem bảng điểm môn học (Giáo viên, Admin, Học sinh)</li>
<li class="has-line-data" data-line-start="17" data-line-end="18">Đăng bài đăng thông báo quan trọng (Giáo viên, Admin)</li>
<li class="has-line-data" data-line-start="18" data-line-end="20">Xem thông báo, tin tức quan trọng (Giáo viên, Admin, Học sinh)</li>
</ul>
<h2 class="code-line" data-line-start=20 data-line-end=21 ><a id="Cng_ngh_s_dng_20"></a>Công nghệ sử dụng</h2>
<ul>
<li class="has-line-data" data-line-start="22" data-line-end="23">[Node.js] - Xử lý API, Back-end</li>
<li class="has-line-data" data-line-start="23" data-line-end="24">[Express] - Framework nằm trên chức năng máy chủ web của NodeJS</li>
<li class="has-line-data" data-line-start="24" data-line-end="25">[Pug] - Template Preprocessor là một cú pháp để viết html</li>
<li class="has-line-data" data-line-start="25" data-line-end="27">[Azure] - MS SQL Server</li>
</ul>
<h2 class="code-line" data-line-start=27 data-line-end=28 ><a id="Ci_t_27"></a>Cài đặt</h2>
<p class="has-line-data" data-line-start="28" data-line-end="30">Yêu cầu: <a href="https://nodejs.org/">Node.js</a> v19+ để có thể chạy chương trình.<br>
Cài đặt các thư viện cần thiết</p>
<pre><code class="has-line-data" data-line-start="32" data-line-end="35" class="language-sh">npm install
npm start
</code></pre>
<h2 class="code-line" data-line-start=36 data-line-end=37 ><a id="Docker_36"></a>Docker</h2>
<p class="has-line-data" data-line-start="38" data-line-end="39">Dillinger is very easy to install and deploy in a Docker container.</p>
<p class="has-line-data" data-line-start="40" data-line-end="43">By default, the Docker will expose port 8080, so change this within the<br>
Dockerfile if necessary. When ready, simply use the Dockerfile to<br>
build the image.</p>
<pre><code class="has-line-data" data-line-start="45" data-line-end="48" class="language-sh"><span class="hljs-built_in">cd</span> dillinger
docker build -t &lt;youruser&gt;/dillinger:<span class="hljs-variable">${package.json.version}</span> .
</code></pre>
<p class="has-line-data" data-line-start="49" data-line-end="52">This will create the dillinger image and pull in the necessary dependencies.<br>
Be sure to swap out <code>${package.json.version}</code> with the actual<br>
version of Dillinger.</p>
<p class="has-line-data" data-line-start="53" data-line-end="56">Once done, run the Docker image and map the port to whatever you wish on<br>
your host. In this example, we simply map port 8000 of the host to<br>
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):</p>
<pre><code class="has-line-data" data-line-start="58" data-line-end="60" class="language-sh">docker run <span class="hljs-operator">-d</span> -p <span class="hljs-number">8000</span>:<span class="hljs-number">8080</span> --restart=always --cap-add=SYS_ADMIN --name=dillinger &lt;youruser&gt;/dillinger:<span class="hljs-variable">${package.json.version}</span>
</code></pre>
<blockquote>
<p class="has-line-data" data-line-start="61" data-line-end="62">Note: <code>--capt-add=SYS-ADMIN</code> is required for PDF rendering.</p>
</blockquote>
<p class="has-line-data" data-line-start="63" data-line-end="65">Verify the deployment by navigating to your server address in<br>
your preferred browser.</p>
<pre><code class="has-line-data" data-line-start="67" data-line-end="69" class="language-sh"><span class="hljs-number">127.0</span>.<span class="hljs-number">0.1</span>:<span class="hljs-number">8000</span>
</code></pre>
<h2 class="code-line" data-line-start=70 data-line-end=71 ><a id="License_70"></a>License</h2>
<p class="has-line-data" data-line-start="71" data-line-end="72">MIT</p>
